-- CreateTable
CREATE TABLE "SearchResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "serperResponse" JSONB,
    "tavilyResponse" JSONB,
    "serperVideos" JSONB,
    "serperNews" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SearchResponse" ADD CONSTRAINT "SearchResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
