"use client";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useTrip } from "~/app/trips/contexts/TripContext";
import { Button } from "~/components/ui/button";
import { DropdownMenu } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

function PackingListPage() {
  const { trip } = useTrip();
  const tripId = trip?.id?.toString() ?? "";
  console.log("Trip ID:", trip);

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Packing List</h1>
      <div className="mt-4 flex w-full items-center space-x-2">
        <Input placeholder="Add a new packing list item" />
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-full focus:outline-none focus:ring-0"
            asChild
          >
            <Button>Select a category</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-100 bg-white p-4">
            <DropdownMenuItem className="text-black">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </main>
  );
}

export default PackingListPage;
