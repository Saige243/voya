/*
  Warnings:

  - You are about to drop the column `date` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `itineraries` table. All the data in the column will be lost.
  - Added the required column `datetime` to the `itineraries` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_itineraries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "tripId" INTEGER NOT NULL,
    "datetime" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "itineraries_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_itineraries" ("createdAt", "id", "location", "notes", "title", "tripId") SELECT "createdAt", "id", "location", "notes", "title", "tripId" FROM "itineraries";
DROP TABLE "itineraries";
ALTER TABLE "new_itineraries" RENAME TO "itineraries";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
