-- CreateEnum
CREATE TYPE "drug_category" AS ENUM ('INTERNAL', 'INJECTION', 'EXTERNAL', 'DENTAL');

-- AlterTable
ALTER TABLE "drugs" ADD COLUMN     "category" "drug_category";

