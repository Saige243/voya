/*
  Warnings:

  - You are about to drop the column `datetime` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `tripId` on the `itinerary_items` table. All the data in the column will be lost.
  - Added the required column `date` to the `itineraries` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_itineraries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "tripId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "itineraries_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_itineraries" ("createdAt", "id", "location", "notes", "title", "tripId") SELECT "createdAt", "id", "location", "notes", "title", "tripId" FROM "itineraries";
DROP TABLE "itineraries";
ALTER TABLE "new_itineraries" RENAME TO "itineraries";
CREATE INDEX "itineraries_date_idx" ON "itineraries"("date");
CREATE TABLE "new_itinerary_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itineraryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "time" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "itinerary_items_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itineraries" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_itinerary_items" ("createdAt", "date", "description", "id", "itineraryId", "location", "notes", "time", "title") SELECT "createdAt", "date", "description", "id", "itineraryId", "location", "notes", "time", "title" FROM "itinerary_items";
DROP TABLE "itinerary_items";
ALTER TABLE "new_itinerary_items" RENAME TO "itinerary_items";
CREATE INDEX "itinerary_items_itineraryId_idx" ON "itinerary_items"("itineraryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
