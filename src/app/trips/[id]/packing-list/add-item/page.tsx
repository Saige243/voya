"use client";

import React from "react";
import { useTrip } from "~/app/trips/contexts/TripContext";

function PackingListPage() {
  const { trip } = useTrip();
  const tripId = trip?.id?.toString() ?? "";
  console.log("Trip ID:", trip);

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Packing List</h1>
      <p className="text-gray-500">ADD PACKING LIST ITEM FORM HERE</p>
    </main>
  );
}

export default PackingListPage;
