import { env } from "@/env.mjs";
import groq from "@/lib/groq";
import { getPineconeClient } from "@/lib/pinecone";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { PineconeStore } from "@langchain/pinecone";
import { getServerSession } from "next-auth";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatCompletionMessageParam } from 'openai/resources/chat';
export const runtime = 'nodejs';
function formatMessages(messages: any[], systemContent: string): ChatCompletionMessageParam[] {
  const formattedMessages: ChatCompletionMessageParam[] = [];

  for (let i = 0; i < messages.length; i++) {
    if (i === 0) {
      formattedMessages.push({
        role: "user",
        content: `${systemContent}\n\nUser: ${messages[i].content}`
      });
    } else {
      formattedMessages.push({
        role: messages[i].role === "user" ? "user" : "assistant",
        content: messages[i].content
      });
    }
  }

  return formattedMessages;
}


export async function POST(req: Request, res: Response) {
  const { messages, docId } = await req.json();

  if (typeof docId !== "string")
    return new Response("Not found", { status: 404 });

  const session = await getServerSession(authOptions);
  if (!session) return new Response("Not found", { status: 404 });

  const doc = await prisma.document.findFirst({
    where: {
      id: docId,
      OR: [
        { ownerId: session?.user.id },
        {
          collaborators: {
            some: {
              userId: session?.user.id,
            },
          },
        },
      ],
    },
  });

  if (!doc?.isVectorised) {
    throw new Error("Document not vectorised.");
  }

  if (!doc) return new Response("Not found", { status: 404 });

  let results: any[] = [];
  try {
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: env.HUGGINGFACE_API_KEY,
    });

    const pinecone = getPineconeClient();
    const pineconeIndex = (await pinecone).Index("docxpert");

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      filter: {
        fileId: docId as string,
      },
    });

    const lastMessage = messages.at(-1).content;
    results = await vectorStore.similaritySearch(lastMessage, 4);
  } catch (err: any) {
    console.warn("Vector similarity search warning (HuggingFace/Pinecone):", err?.message || err);
  }

  let contextText = "";
  if (results.length > 0) {
    contextText = results.map((r) => r.pageContent).join("\n\n");
  } else {
    try {
      const pdfRes = await fetch(doc.url);
      const blob = await pdfRes.blob();
      const loader = new PDFLoader(blob);
      const pdfDocs = await loader.load();
      contextText = pdfDocs.map((p) => p.pageContent).join("\n\n").slice(0, 12000);
    } catch (e: any) {
      console.warn("Direct PDF text fallback warning:", e?.message || e);
      contextText = `Document Title: ${doc.title}`;
    }
  }

  const systemContent = `AI assistant is a brand new, powerful, human-like artificial intelligence.
  The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
  AI is a well-behaved and well-mannered individual.
  AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
  AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
  START CONTEXT BLOCK
  ${contextText}
  END OF CONTEXT BLOCK
  AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
  AI assistant will answer the questions in Markdown format with clear headings and lists.`;

  const formattedMessages = formatMessages(messages, systemContent);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    stream: true,
    max_tokens: 4096,
    messages: formattedMessages,
  });

  const stream = OpenAIStream(response, {
    onStart: async () => {
      await prisma.message.create({
        data: {
          text: messages.at(-1).content,
          isUserMessage: true,
          documentId: docId,
          userId: session?.user.id,
        },
      });
    },
    onCompletion: async (completion: string) => {
      await prisma.$transaction([
        prisma.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            documentId: docId,
          },
        }),
        prisma.documentCounts.upsert({
          where: { documentId: docId },
          update: { chatCount: { increment: 1 } },
          create: { documentId: docId, chatCount: 1 },
        }),
      ]);
    },
  });
  return new StreamingTextResponse(stream);
}
