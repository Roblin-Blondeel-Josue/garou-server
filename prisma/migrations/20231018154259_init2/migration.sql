-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "rang" TEXT DEFAULT 'Louveteau',
    "tribe" TEXT,
    "clan" TEXT,
    "auspice" TEXT NOT NULL,
    "secondAuspice" TEXT DEFAULT 'Aucune',

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);
