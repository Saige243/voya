"use client";

import React, { useEffect } from "react";
import { useTrip } from "~/app/trips/contexts/TripContext";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import getPackingCategories from "~/app/trips/actions/getPackingCategories";
import { type PackingCategory } from "@prisma/client";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { Card, CardContent } from "~/components/ui/card";

function AddItemPage() {
  const { trip } = useTrip();
  const tripId = trip?.id?.toString() ?? "";
  const [packingCategories, setPackingCategories] = React.useState<
    PackingCategory[]
  >([]);

  useEffect(() => {
    const fetchPackingCategories = async () => {
      try {
        const categories = await getPackingCategories();
        console.log("Fetched packing categories:", categories);
        setPackingCategories(categories);
      } catch (error) {
        console.error("Error fetching packing categories:", error);
      }
    };

    void fetchPackingCategories();
  }, [tripId]);

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Packing List</h1>
      <div className="mt-4 flex w-full items-center space-x-2">
        <Card className="w-full">
          <CardContent>
            <div className="flex w-full flex-row">
              <Input
                className="input input-bordered w-full dark:bg-white"
                placeholder="Add a new packing list item"
              />

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {packingCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default AddItemPage;
