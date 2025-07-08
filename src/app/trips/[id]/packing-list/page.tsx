"use client";

import React from "react";
import getPackingList from "../../actions/getPackingList";
import { useTrip } from "~/app/trips/contexts/TripContext";

function PackingListPage() {
  const { trip } = useTrip();
  const tripId = trip?.id?.toString() ?? "";
  const packingList = getPackingList(tripId);

  const emptyList = (
    <div>
      <p className="text-gray-500">Your packing list is empty.</p>
      <p className="text-gray-500">Click the button below to add items.</p>
      <button className="btn btn-primary mt-4">Add Item</button>
    </div>
  );

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Packing List</h1>
      <p className="text-gray-500">
        This is where you can manage your packing list.
      </p>
      <button className="btn btn-primary">Add Item</button>
    </main>
  );
}

export default PackingListPage;
