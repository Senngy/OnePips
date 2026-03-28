/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "InterestType" AS ENUM ('COURS', 'SIGNAUX', 'ACCOMPAGNEMENT', 'ONE_TO_ONE');

-- CreateEnum
CREATE TYPE "MarketType" AS ENUM ('CFD', 'CRYPTO', 'FUTURES');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('PERSONAL', 'DEMO', 'PROPFIRM');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "accountType" "AccountType"[],
ADD COLUMN     "budgetFormation" INTEGER,
ADD COLUMN     "budgetTrading" INTEGER,
ADD COLUMN     "interests" "InterestType"[],
ADD COLUMN     "markets" "MarketType"[],
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "tradingYears" INTEGER,
ALTER COLUMN "score" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");
