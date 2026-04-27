/*
  Warnings:

  - You are about to drop the column `userId` on the `EventParticipant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId,leadId]` on the table `EventParticipant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `leadId` to the `EventParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EventParticipant_eventId_userId_key";

-- AlterTable
ALTER TABLE "EventParticipant" DROP COLUMN "userId",
ADD COLUMN     "leadId" TEXT NOT NULL,
ALTER COLUMN "joinedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "EventParticipant_eventId_leadId_key" ON "EventParticipant"("eventId", "leadId");

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
