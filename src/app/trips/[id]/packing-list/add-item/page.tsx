"use client";

import React from "react";
import { useTrip } from "~/app/trips/contexts/TripContext";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

function PackingListPage() {
  const { trip } = useTrip();
  const tripId = trip?.id?.toString() ?? "";
  console.log("Trip ID:", trip);

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Packing List</h1>
      <div className="mt-4 flex w-full items-center space-x-2">
        <Input placeholder="Add a new packing list item" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </main>
  );
}

export default PackingListPage;
