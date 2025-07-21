/*
  Warnings:

  - You are about to drop the column `notes` on the `packing_list_items` table. All the data in the column will be lost.

*/
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "packing_list_items_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "packing_lists" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "packing_list_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PackingCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_packing_list_items" ("categoryId", "createdAt", "id", "isPacked", "name", "packingListId", "quantity") SELECT "categoryId", "createdAt", "id", "isPacked", "name", "packingListId", "quantity" FROM "packing_list_items";
DROP TABLE "packing_list_items";
ALTER TABLE "new_packing_list_items" RENAME TO "packing_list_items";
CREATE INDEX "packing_list_items_packingListId_idx" ON "packing_list_items"("packingListId");
CREATE INDEX "packing_list_items_categoryId_idx" ON "packing_list_items"("categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
