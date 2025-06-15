/*
  Warnings:

  - Added the required column `flashcount` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questioncount` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `researchcount` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN "flashcount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Document" ADD COLUMN "questioncount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Document" ADD COLUMN "researchcount" INTEGER NOT NULL DEFAULT 0;
