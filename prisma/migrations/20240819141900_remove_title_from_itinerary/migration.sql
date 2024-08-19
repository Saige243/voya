/*
  Warnings:

  - You are about to drop the column `title` on the `itineraries` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itineraryId" INTEGER,
    "tripId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activities_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itineraries" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "activities_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_activities" ("createdAt", "date", "description", "id", "location", "notes", "time", "title", "tripId") SELECT "createdAt", "date", "description", "id", "location", "notes", "time", "title", "tripId" FROM "activities";
DROP TABLE "activities";
ALTER TABLE "new_activities" RENAME TO "activities";
CREATE TABLE "new_itineraries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
