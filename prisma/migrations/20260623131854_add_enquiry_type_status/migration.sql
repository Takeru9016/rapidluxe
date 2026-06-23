-- CreateEnum
CREATE TYPE "EnquiryType" AS ENUM ('CORPORATE', 'GENERAL');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('OPEN', 'RESOLVED');

-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "status" "EnquiryStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "type" "EnquiryType" NOT NULL DEFAULT 'GENERAL';

-- Backfill: existing corporate-account enquiries were tagged via subject prefix
UPDATE "Enquiry" SET "type" = 'CORPORATE' WHERE "subject" LIKE 'Corporate Account Request%';
