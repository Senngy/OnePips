-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'USERS_READ';
ALTER TYPE "Permission" ADD VALUE 'ADMINS_MANAGE';
ALTER TYPE "Permission" ADD VALUE 'ROLES_MANAGE';
ALTER TYPE "Permission" ADD VALUE 'FILES_UPLOAD';

-- AlterTable
ALTER TABLE "UserPermission" ADD COLUMN     "granted" BOOLEAN NOT NULL DEFAULT true;
