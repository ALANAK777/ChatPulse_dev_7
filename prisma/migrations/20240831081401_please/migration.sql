/*
  Warnings:

  - You are about to drop the column `flashcount` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `questioncount` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `researchcount` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "flashcount",
DROP COLUMN "questioncount",
DROP COLUMN "researchcount";

-- CreateTable
CREATE TABLE "DocumentCounts" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "questionCount" INTEGER NOT NULL DEFAULT 0,
    "researchCount" INTEGER NOT NULL DEFAULT 0,
    "flashCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentCounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentCounts_documentId_key" ON "DocumentCounts"("documentId");

-- AddForeignKey
ALTER TABLE "DocumentCounts" ADD CONSTRAINT "DocumentCounts_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
