import groq from "@/lib/groq";
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
      return groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2048,
        messages: [
          {
            role: "system",
            content: `You are an advanced AI assistant specialized in creating educational questions. Your task is to generate a mix of 2-mark and 5-mark questions and answers based on the provided text.
Provide the output strictly as a JSON Array of objects, where each object has 'question', 'marks', 'answer', and 'type' fields.
Example format:
[
  {"question": "What is X?", "marks": 2, "answer": "X is...", "type": "short"},
  {"question": "Explain Y in detail.", "marks": 5, "answer": "Y is...", "type": "long"}
]
Do not include any markdown fences or conversational text outside the JSON array.`,
          },
          {
            role: "user",
            content: `Create questions and answers for the following text:\n\n ${doc}`,
          },
        ],
      });
    }),
  );

  const newRes = res.map((item) =>
    item.status === "fulfilled"
      ? item.value.choices[0]?.message.content?.trim() || ""
      : "",
  );

  const formatted = newRes.map((item) => {
    if (!item) return [];

    try {
      let jsonStr = item.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      }
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "object" && parsed !== null) {
        if (Array.isArray(parsed.questions)) return parsed.questions;
      }
      return [];
    } catch (err: any) {
      console.log("Question JSON parse error:", err.message, "Raw content:", item);
      return [];
    }
  });

  const flatArr: QuestionType[] = formatted.flat().filter((item: any) => {
    if (!item || typeof item !== "object") return false;
    if (!item.question || !item.answer) return false;
    item.marks = item.marks || 5;
    item.type = item.type || "short";
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
