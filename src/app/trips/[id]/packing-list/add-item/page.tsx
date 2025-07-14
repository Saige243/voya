"use client";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useTrip } from "~/app/trips/contexts/TripContext";
import { DropdownMenu } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

function PackingListPage() {
  const { trip } = useTrip();
  const tripId = trip?.id?.toString() ?? "";
  console.log("Trip ID:", trip);

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Packing List</h1>
      <Input placeholder="Add a new packing list item" />
      <DropdownMenu>
        <DropdownMenuTrigger>Add Item</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Add to Packing List</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </main>
  );
}

export default PackingListPage;
