import { Pinecone } from "@pinecone-database/pinecone";

export const getPineconeClient = async () => {
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const indexName = "docxpert";
  const existingIndexes = await pc.listIndexes();

  if (!existingIndexes?.indexes?.some(index => index.name === indexName)) {
    await pc.createIndex({
      name: indexName,
      dimension: 768,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
  }

  return pc;
};


