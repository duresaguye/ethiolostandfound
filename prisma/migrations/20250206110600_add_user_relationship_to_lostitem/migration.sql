/*
  Warnings:

  - You are about to drop the `LostItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "LostItem";

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
