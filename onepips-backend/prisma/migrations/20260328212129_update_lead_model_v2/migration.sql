/*
  Warnings:

  - The values [HOT,WARM,COLD] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [COURS,SIGNAUX,ACCOMPAGNEMENT] on the enum `InterestType` will be removed. If these variants are still used in the database, this will fail.
  - The values [NEW,QUALIFIED,REJECTED] on the enum `LeadStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStatus_new" AS ENUM ('NEW', 'CHECKED', 'QUALIFIED', 'PENDING');
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus_new" USING ("status"::text::"ApplicationStatus_new");
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "public"."ApplicationStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "InterestType_new" AS ENUM ('SIGNALS', 'PRIVATE_COACHING', 'ONE_TO_ONE', 'LIVES_SUBSCRIPTION');
ALTER TABLE "Lead" ALTER COLUMN "interests" TYPE "InterestType_new"[] USING ("interests"::text::"InterestType_new"[]);
ALTER TYPE "InterestType" RENAME TO "InterestType_old";
ALTER TYPE "InterestType_new" RENAME TO "InterestType";
DROP TYPE "public"."InterestType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('HOT', 'MID', 'COLD', 'PENDING');
ALTER TABLE "public"."Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING ("status"::text::"LeadStatus_new");
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "public"."LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'PENDING';
