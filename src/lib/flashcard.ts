import groq from "@/lib/groq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const generateFlashcards = async (
  fileUrl: string,
  maxPagesAllowed: number,
) => {
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const loader = new PDFLoader(blob);

  const pageLevelDocs = await loader.load();
  // better to add pagecount to db, so that "5 page" limit can be checked easily.
  const pageCount = pageLevelDocs.length;

  if (pageCount > maxPagesAllowed) {
    throw new Error(
      `Document to generate flashcards can have at max ${maxPagesAllowed} pages. Upgrade to use larger documents.`,
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
            content: `You are an expert AI assistant that generates study flashcards from text.
Generate 2-3 clear, self-contained question and answer pairs from the provided text.
IMPORTANT: Output strictly a JSON Array of objects with "question" and "answer" properties.
Example format:
[
  {"question": "What is X?", "answer": "X is Y."},
  {"question": "How does Z work?", "answer": "Z works by..."}
]
Do not include any explanations, markdown headers, or extra text outside the JSON array.`,
          },
          {
            role: "user",
            content: `Create question and answer pairs for the following text:\n\n ${doc}`,
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
        if (Array.isArray(parsed.flashcards)) return parsed.flashcards;
        if (Array.isArray(parsed.questions)) return parsed.questions;
        return Object.entries(parsed).map(([q, a]) => ({
          question: q,
          answer: typeof a === "string" ? a : JSON.stringify(a),
        }));
      }
      return [];
    } catch (err: any) {
      console.log("Flashcard JSON parse error:", err.message, "Raw content:", item);
      return [];
    }
  });

  const flatArr: FlashcardType[] = formatted.flat().filter((item: any) => {
    if (!item || typeof item !== "object") return false;
    const q = item.question || item.q || item.prompt;
    const a = item.answer || item.a || item.response;
    if (q && a) {
      item.question = String(q);
      item.answer = String(a);
      return true;
    }
    return false;
  });
  return flatArr;
};

interface FlashcardType {
  question: string;
  answer: string;
}
