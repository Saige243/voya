-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_itineraries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "tripId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "itineraries_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_itineraries" ("createdAt", "date", "id", "location", "notes", "title", "tripId") SELECT "createdAt", "date", "id", "location", "notes", "title", "tripId" FROM "itineraries";
DROP TABLE "itineraries";
ALTER TABLE "new_itineraries" RENAME TO "itineraries";
CREATE INDEX "itineraries_date_idx" ON "itineraries"("date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
