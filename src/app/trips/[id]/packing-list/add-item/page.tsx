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
import { type PackingCategory, type PackingListItem } from "@prisma/client";
import { SelectGroup } from "@radix-ui/react-select";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

function AddItemPage() {
  const { trip } = useTrip();
  const tripId = trip?.id?.toString() ?? "";

  const [packingCategories, setPackingCategories] = React.useState<
    PackingCategory[]
  >([]);
  const [items, setItems] = React.useState<PackingListItem[]>([
    {
      id: Date.now(),
      createdAt: new Date(),
      packingListId: 0,
      categoryId: 0,
      name: "",
      quantity: 1,
      isPacked: false,
      notes: "",
    },
  ]);

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

  const handleAddMore = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        createdAt: new Date(),
        packingListId: 0,
        categoryId: 0,
        name: "",
        quantity: 1,
        isPacked: false,
        notes: "",
      },
    ]);
  };

  const handleItemChange = <K extends keyof PackingListItem>(
    index: number,
    key: K,
    value: PackingListItem[K],
  ) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [key]: value } as PackingListItem;
      return newItems;
    });
  };

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Packing List</h1>

      <div className="mt-4 w-full space-y-4">
        <Card>
          {items.map((item, index) => (
            <CardContent key={item.id} className="space-y-2 pt-4">
              <div className="flex flex-row space-x-2">
                <Input
                  className="w-full dark:bg-white"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                />

                <Select
                  value={item.categoryId.toString()}
                  onValueChange={(value) =>
                    handleItemChange(index, "categoryId", parseInt(value))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {packingCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          ))}
        </Card>

        <Button className="w-full" onClick={handleAddMore}>
          Add Another Item
        </Button>
      </div>
    </main>
  );
}

export default AddItemPage;
