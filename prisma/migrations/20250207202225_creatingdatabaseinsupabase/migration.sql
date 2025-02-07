/*
  Warnings:

  - You are about to drop the `lost_item` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedPassword` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "lost_item" DROP CONSTRAINT "lost_item_userId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "hashedPassword" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "lost_item";

-- CreateIndex
CREATE UNIQUE INDEX "session_userId_key" ON "session"("userId");
