import fireworks from "@/lib/fireworks";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const generateQuestions = async (
  fileUrl: string,
  maxPagesAllowed: number,
) => {
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const loader = new PDFLoader(blob);

  const pageLevelDocs = await loader.load();
  const pageCount = pageLevelDocs.length;

  if (pageCount > maxPagesAllowed) {
    throw new Error(
      `Document to generate questions can have at max ${maxPagesAllowed} pages. Upgrade to use larger documents.`,
    );
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await textSplitter.splitDocuments(pageLevelDocs);
  const docContents = splitDocs.map((doc) => {
    return doc.pageContent.replace(/\n/g, " ");
  });

  const res = await Promise.allSettled(
    docContents.map(async (doc) => {
      return fireworks.chat.completions.create({
        model: "accounts/fireworks/models/mixtral-8x7b-instruct",
        max_tokens: 2048,
        messages: [
          {
            role: "system",
            content: `You are an advanced AI assistant specialized in creating educational questions. Your task is to generate a mix of 2-mark and 5-mark questions and answers based on the provided text. For 2-mark questions, focus on factual recall and brief explanations. For 5-mark questions, emphasize deeper understanding, application of concepts, and critical thinking. Create clear, concise, and relevant questions and answers. Provide the output in JSON Array format, with each question object containing 'question', 'marks','answer' and 'type' fields.`,
          },
          {
            role: "user",
            content: `Create  5-mark questions and answers for the following text:\n\n ${doc}`,
          },
        ],
      });
    }),
  );

  const newRes = res.map((item) =>
    item.status === "fulfilled"
      ? item.value.choices[0]?.message.content?.replaceAll("\n", "")
      : "",
  );

  const formatted = newRes.map((item) => {
    if (!item) {
      return "";
    }

    try {
      return JSON.parse(item);
    } catch (err: any) {
      console.log(err.message);
      return "";
    }
  });

  const flatArr: QuestionType[] = formatted.flat().filter((item) => {
    if (!item.question || !item.marks || !item.type) {
      return false;
    }
    return true;
  });
  return flatArr;
};

interface QuestionType {
  question: string;
  marks: number;
  answer:string;
  type: string;
}
