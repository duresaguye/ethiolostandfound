/*
  Warnings:

  - You are about to drop the column `hashedPassword` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "session_userId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "hashedPassword",
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "lost_item" (
    "id" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'lost',
    "userId" TEXT NOT NULL,

    CONSTRAINT "lost_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lost_item" ADD CONSTRAINT "lost_item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
