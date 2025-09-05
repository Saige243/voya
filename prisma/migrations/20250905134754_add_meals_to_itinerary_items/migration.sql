/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Post_name_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_itinerary_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itineraryId" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "time" DATETIME,
    "location" TEXT,
    "isMeal" BOOLEAN NOT NULL DEFAULT false,
    "mealType" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "itinerary_items_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itineraries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_itinerary_items" ("createdAt", "description", "id", "itineraryId", "location", "notes", "time", "title") SELECT "createdAt", "description", "id", "itineraryId", "location", "notes", "time", "title" FROM "itinerary_items";
DROP TABLE "itinerary_items";
ALTER TABLE "new_itinerary_items" RENAME TO "itinerary_items";
CREATE INDEX "itinerary_items_itineraryId_idx" ON "itinerary_items"("itineraryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
