"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";
import { type PackingCategory, type PackingListItem } from "@prisma/client";
import { SelectGroup } from "@radix-ui/react-select";
import { Card, CardContent } from "~/_components/ui/card";
import { Checkbox } from "~/_components/ui/checkbox";
import { Label } from "~/_components/ui/label";
import { Icon } from "~/_components/common/Icon";
import { api } from "~/trpc/react";

type NewPackingListItem = Omit<
  PackingListItem,
  "id" | "createdAt" | "packingListId"
>;

interface ModalProps {
  tripId: number;
  onConfirm: () => void;
}

function NewPackingItemModal({ tripId, onConfirm }: ModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packingCategories, setPackingCategories] = useState<PackingCategory[]>(
    [],
  );
  const [items, setItems] = useState<NewPackingListItem[]>([
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
      setOpen(false);
      onConfirm();
    },
    onError: (error) => {
      setError("Failed to save items. Please try again.");
      console.error("Error saving items:", error);
    },
  });

  const { data } = api.packingCategory.getAll.useQuery();

  useEffect(() => {
    if (data) {
      setPackingCategories(data);
    }
  }, [data]);

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
    setLoading(true);
    setError(null);

    try {
      await createMany.mutateAsync({
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
    } catch (err) {
      setError("Failed to save items. Please try again.");
      console.error("Error saving items:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setItems([
      {
        categoryId: 0,
        name: "",
        quantity: 1,
        isPacked: false,
      },
    ]);
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Icon name="Plus" className="inline" size="16" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Packing List Items</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 w-full space-y-4">
          <Card>
            {items.map((item, index) => (
              <CardContent key={index} className="space-y-2 pt-4">
                <div className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-12">
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
                        handleItemChange(
                          index,
                          "quantity",
                          isNaN(val) ? 1 : val,
                        );
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
                      <SelectTrigger
                        id={`category-${index}`}
                        className="w-full"
                      >
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
                    <div className="flex flex-col items-center justify-center space-y-2">
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

          <Button
            className="w-full text-black"
            type="submit"
            variant="outline"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : items.length > 1
                ? "Save Items"
                : "Save Item"}
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewPackingItemModal;
