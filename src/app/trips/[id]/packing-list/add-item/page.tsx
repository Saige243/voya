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
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

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
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-6">
                  <Label htmlFor={`name-${index}`}>Item Name</Label>
                  <Input
                    id={`name-${index}`}
                    className="w-full dark:bg-white"
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    className="w-full dark:bg-white"
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity ?? ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleItemChange(index, "quantity", val);
                    }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor={`category-${index}`}>Category</Label>
                  <Select
                    value={item.categoryId.toString()}
                    onValueChange={(value) =>
                      handleItemChange(index, "categoryId", parseInt(value))
                    }
                  >
                    <SelectTrigger id={`category-${index}`} className="w-full">
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

                <div className="sm:col-span-1">
                  <div className="flex flex-col items-center space-y-2">
                    <Label htmlFor={`packed-${index}`}>Packed?</Label>
                    <Checkbox
                      id={`packed-${index}`}
                      checked={item.isPacked}
                      onCheckedChange={(checked) =>
                        handleItemChange(index, "isPacked", checked === true)
                      }
                    />
                  </div>
                </div>
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
