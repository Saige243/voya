/*
  Warnings:

  - Made the column `title` on table `itinerary_items` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_itinerary_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itineraryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "time" DATETIME,
    "location" TEXT,
    "isMeal" BOOLEAN NOT NULL DEFAULT false,
    "mealType" TEXT,
    "link" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "itinerary_items_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itineraries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_itinerary_items" ("createdAt", "description", "id", "isMeal", "itineraryId", "link", "location", "mealType", "notes", "time", "title") SELECT "createdAt", "description", "id", "isMeal", "itineraryId", "link", "location", "mealType", "notes", "time", "title" FROM "itinerary_items";
DROP TABLE "itinerary_items";
ALTER TABLE "new_itinerary_items" RENAME TO "itinerary_items";
CREATE INDEX "itinerary_items_itineraryId_idx" ON "itinerary_items"("itineraryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
