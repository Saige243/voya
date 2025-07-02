-- CreateTable
CREATE TABLE "packing_lists" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tripId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "packing_lists_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "packing_list_groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "packingListId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "packing_list_groups_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "packing_lists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "packing_list_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "packingListGroupId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isPacked" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "packing_list_items_packingListGroupId_fkey" FOREIGN KEY ("packingListGroupId") REFERENCES "packing_list_groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "packing_lists_tripId_key" ON "packing_lists"("tripId");

-- CreateIndex
CREATE INDEX "packing_lists_tripId_idx" ON "packing_lists"("tripId");

-- CreateIndex
CREATE INDEX "packing_list_groups_packingListId_idx" ON "packing_list_groups"("packingListId");

-- CreateIndex
CREATE INDEX "packing_list_items_packingListGroupId_idx" ON "packing_list_items"("packingListGroupId");
