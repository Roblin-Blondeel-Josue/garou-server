/*
  Warnings:

  - You are about to drop the column `tribe` on the `Character` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "tribe",
ADD COLUMN     "alliance" TEXT,
ADD COLUMN     "attributes" JSONB,
ADD COLUMN     "crys" TEXT[],
ADD COLUMN     "gnose" INTEGER DEFAULT 2,
ADD COLUMN     "legends" JSONB,
ADD COLUMN     "politics" JSONB,
ADD COLUMN     "rituals" TEXT[],
ADD COLUMN     "skills" JSONB,
ADD COLUMN     "talents" JSONB,
ADD COLUMN     "tribeId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "willpower" INTEGER,
ADD COLUMN     "wods" JSONB;

-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cost" TEXT,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bonus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cost" TEXT,

    CONSTRAINT "Bonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Malus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cost" TEXT,

    CONSTRAINT "Malus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tribe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clans" TEXT[],
    "alliance" TEXT NOT NULL,
    "bonus" TEXT NOT NULL,
    "malus" TEXT NOT NULL,

    CONSTRAINT "Tribe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacterToGifts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CharacterToMalus" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CharacterToBonus" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterToGifts_AB_unique" ON "_CharacterToGifts"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterToGifts_B_index" ON "_CharacterToGifts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterToMalus_AB_unique" ON "_CharacterToMalus"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterToMalus_B_index" ON "_CharacterToMalus"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterToBonus_AB_unique" ON "_CharacterToBonus"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterToBonus_B_index" ON "_CharacterToBonus"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToGifts" ADD CONSTRAINT "_CharacterToGifts_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToGifts" ADD CONSTRAINT "_CharacterToGifts_B_fkey" FOREIGN KEY ("B") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToMalus" ADD CONSTRAINT "_CharacterToMalus_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToMalus" ADD CONSTRAINT "_CharacterToMalus_B_fkey" FOREIGN KEY ("B") REFERENCES "Malus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToBonus" ADD CONSTRAINT "_CharacterToBonus_A_fkey" FOREIGN KEY ("A") REFERENCES "Bonus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToBonus" ADD CONSTRAINT "_CharacterToBonus_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
