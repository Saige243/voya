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
import { Icon } from "~/components/common/Icon";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

type NewPackingListItem = Omit<
  PackingListItem,
  "id" | "createdAt" | "packingListId"
>;

function AddItemPage() {
  const { trip } = useTrip();
  const router = useRouter();
  const tripId = trip?.id;

  const [packingCategories, setPackingCategories] = React.useState<
    PackingCategory[]
  >([]);
  const [items, setItems] = React.useState<NewPackingListItem[]>([
    {
      categoryId: 0,
      name: "",
      quantity: 1,
      isPacked: false,
    },
  ]);

  const createMany = api.packingList.createMany.useMutation({
    onSuccess: () => {
      console.log("Items saved successfully");
      setItems([
        {
          categoryId: 0,
          name: "",
          quantity: 1,
          isPacked: false,
        },
      ]);
    },
    onError: (error) => {
      console.error("Error saving items:", error);
    },
  });

  useEffect(() => {
    if (!trip) {
      router.replace("/");
    }

    const fetchPackingCategories = async () => {
      try {
        const categories = await getPackingCategories();
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
        categoryId: 0,
        name: "",
        quantity: 1,
        isPacked: false,
      },
    ]);
  };

  const handleItemChange = <K extends keyof NewPackingListItem>(
    index: number,
    key: K,
    value: NewPackingListItem[K],
  ) => {
    setItems((prev) => {
      const newItems = [...prev];
      const currentItem = newItems[index] ?? {
        categoryId: 0,
        name: "",
        quantity: 1,
        isPacked: false,
      };
      newItems[index] = {
        categoryId: currentItem.categoryId ?? 0,
        name: currentItem.name ?? "",
        quantity: currentItem.quantity ?? 1,
        isPacked: currentItem.isPacked ?? false,
        [key]: value,
      };
      return newItems;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId) return console.warn("No trip ID");

    createMany.mutate({
      tripId,
      items: items.map((item) => {
        return {
          categoryId: item.categoryId ?? 0,
          name: item.name ?? "",
          quantity: item.quantity ?? 1,
          isPacked: item.isPacked ?? false,
        } as NewPackingListItem;
      }),
    });
  };

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Packing List</h1>

      <form onSubmit={handleSubmit} className="mt-4 w-full space-y-4">
        <Card>
          {items.map((item, index) => (
            <CardContent key={index} className="space-y-2 pt-4">
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
                    value={item.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      handleItemChange(index, "quantity", isNaN(val) ? 1 : val);
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

        <Button type="button" className="w-full" onClick={handleAddMore}>
          <Icon size="sm" name="Plus" /> Add Another Item
        </Button>

        <Button className="w-full text-black" type="submit" variant="outline">
          {items.length > 1 ? "Save Items" : "Save Item"}
        </Button>
      </form>
    </main>
  );
}

export default AddItemPage;
