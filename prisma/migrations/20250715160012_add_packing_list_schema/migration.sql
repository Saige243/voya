/*
  Warnings:

  - You are about to drop the `packing_list_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `packingListGroupId` on the `packing_list_items` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `packing_list_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packingListId` to the `packing_list_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "packing_list_groups_packingListId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "packing_list_groups";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PackingItemPreset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "PackingItemPreset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PackingCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PackingCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_packing_list_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "packingListId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isPacked" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "packing_list_items_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "packing_lists" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "packing_list_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PackingCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_packing_list_items" ("createdAt", "id", "isPacked", "name", "notes", "quantity") SELECT "createdAt", "id", "isPacked", "name", "notes", "quantity" FROM "packing_list_items";
DROP TABLE "packing_list_items";
ALTER TABLE "new_packing_list_items" RENAME TO "packing_list_items";
CREATE INDEX "packing_list_items_packingListId_idx" ON "packing_list_items"("packingListId");
CREATE INDEX "packing_list_items_categoryId_idx" ON "packing_list_items"("categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PackingCategory_name_key" ON "PackingCategory"("name");
