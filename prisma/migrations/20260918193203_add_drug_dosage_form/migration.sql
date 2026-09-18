-- CreateEnum
CREATE TYPE "dosage_form" AS ENUM ('TABLET', 'OD_TABLET', 'CAPSULE', 'POWDER', 'LIQUID', 'SKIN_APPLICATION', 'EYE_EAR_NOSE', 'PATCH', 'SUPPOSITORY', 'INHALANT', 'INJECTION', 'OTHER');

-- AlterTable
ALTER TABLE "drugs" ADD COLUMN     "dosage_form" "dosage_form";

