/*
  Warnings:

  - Added the required column `answer` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "answer" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GeneratedQuestion" (
    "id" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "marks" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeneratedQuestion" ADD CONSTRAINT "GeneratedQuestion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
