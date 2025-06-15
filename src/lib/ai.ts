import fireworks from "@/lib/fireworks";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const generateSummary = async (fileUrl: string, maxPagesAllowed: number) => {
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const loader = new PDFLoader(blob);

  const pageLevelDocs = await loader.load();
  const pageCount = pageLevelDocs.length;

  if (pageCount > maxPagesAllowed) {
    throw new Error(`Document can have at max ${maxPagesAllowed} pages. Upgrade to use larger documents.`);
  }

  const fullText = pageLevelDocs.map(doc => doc.pageContent).join(' ');
  
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 30000,
    chunkOverlap: 200,
  });

  const chunks = await textSplitter.splitText(fullText);

  let allKeywords: string[] = [];

  for (const chunk of chunks) {
    const res = await fireworks.chat.completions.create({
      model: "accounts/fireworks/models/mixtral-8x7b-instruct",
      max_tokens: 2048,
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that provides exactly 6 keywords from documents, formatted as an array without any additional explanation or commentary.",
        },
        {
          role: "user",
          content: `Extract exactly 6 keywords from the following text. No more, no less. Return only the keywords as an array:\n\n${chunk}`,
        },
      ]
    });

    const summary = res.choices[0]?.message.content?.trim();
    const keywordsArray = summary ? summary.replace(/^\[|\]$/g, '').split(',').map(s => s.trim()) : [];
    allKeywords = [...allKeywords, ...keywordsArray];
  }

  // Get unique keywords and limit to 6
  const uniqueKeywords = [...new Set(allKeywords)].slice(0, 6);
  const keywordsString = uniqueKeywords.join(', ');

  //console.log("keywords", keywordsString);
  return keywordsString;
};