-- DropForeignKey
ALTER TABLE "GeneratedQuestion" DROP CONSTRAINT "GeneratedQuestion_documentId_fkey";

-- AddForeignKey
ALTER TABLE "GeneratedQuestion" ADD CONSTRAINT "GeneratedQuestion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
