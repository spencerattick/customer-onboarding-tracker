/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `Week` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Account` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_dseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Week" DROP CONSTRAINT "Week_accountId_fkey";

-- AlterTable
ALTER TABLE "public"."Account" ALTER COLUMN "dseId" DROP NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Week" ALTER COLUMN "accountId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Week_accountId_key" ON "public"."Week"("accountId");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_dseId_fkey" FOREIGN KEY ("dseId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Week" ADD CONSTRAINT "Week_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
