/*
  Warnings:

  - Added the required column `title` to the `itineraries` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_itineraries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "tripId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "time" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "itineraries_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_itineraries" ("createdAt", "date", "id", "location", "notes", "time", "tripId") SELECT "createdAt", "date", "id", "location", "notes", "time", "tripId" FROM "itineraries";
DROP TABLE "itineraries";
ALTER TABLE "new_itineraries" RENAME TO "itineraries";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
