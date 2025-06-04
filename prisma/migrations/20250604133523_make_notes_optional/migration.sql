-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accommodations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tripId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phoneNumber" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    CONSTRAINT "accommodations_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_accommodations" ("checkIn", "checkOut", "createdAt", "id", "location", "name", "notes", "phoneNumber", "tripId", "website") SELECT "checkIn", "checkOut", "createdAt", "id", "location", "name", "notes", "phoneNumber", "tripId", "website" FROM "accommodations";
DROP TABLE "accommodations";
ALTER TABLE "new_accommodations" RENAME TO "accommodations";
CREATE TABLE "new_itineraries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "tripId" INTEGER NOT NULL,
    "datetime" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "itineraries_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_itineraries" ("createdAt", "datetime", "id", "location", "notes", "title", "tripId") SELECT "createdAt", "datetime", "id", "location", "notes", "title", "tripId" FROM "itineraries";
DROP TABLE "itineraries";
ALTER TABLE "new_itineraries" RENAME TO "itineraries";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
