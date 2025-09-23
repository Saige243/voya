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
import { Typography } from "~/_components/common/Typography";
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
        <form onSubmit={handleSubmit} className="mt-4 w-full space-y-6">
          {/* Items List */}
          <div className="space-y-4">
            {items.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-2">
                  <div className="mb-3 flex items-center justify-between">
                    <Typography className="text-sm font-medium text-gray-600">
                      Item {index + 1}
                    </Typography>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = items.filter((_, i) => i !== index);
                          setItems(
                            newItems.length > 0
                              ? newItems
                              : [
                                  {
                                    categoryId: 0,
                                    name: "",
                                    quantity: 1,
                                    isPacked: false,
                                  },
                                ],
                          );
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Icon name="X" size="16" />
                      </Button>
                    )}
                  </div>

                  <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-12">
                    <div className="sm:col-span-6">
                      <Label
                        htmlFor={`name-${index}`}
                        className="text-sm font-medium"
                      >
                        Item Name *
                      </Label>
                      <Input
                        id={`name-${index}`}
                        className="mt-1"
                        placeholder="e.g., Toothbrush, Camera, Passport"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label
                        htmlFor={`quantity-${index}`}
                        className="text-sm font-medium"
                      >
                        Quantity
                      </Label>
                      <Input
                        id={`quantity-${index}`}
                        className="mt-1"
                        type="number"
                        min="1"
                        placeholder="1"
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
                      <Label
                        htmlFor={`category-${index}`}
                        className="text-sm font-medium"
                      >
                        Category
                      </Label>
                      <Select
                        value={item.categoryId.toString()}
                        onValueChange={(value) =>
                          handleItemChange(index, "categoryId", parseInt(value))
                        }
                      >
                        <SelectTrigger
                          id={`category-${index}`}
                          className="mt-1"
                        >
                          <SelectValue placeholder="Select category" />
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
                        <Label
                          htmlFor={`packed-${index}`}
                          className="text-sm font-medium"
                        >
                          Packed?
                        </Label>
                        <Checkbox
                          id={`packed-${index}`}
                          checked={item.isPacked}
                          onCheckedChange={(checked) =>
                            handleItemChange(
                              index,
                              "isPacked",
                              checked === true,
                            )
                          }
                          className="h-5 w-5"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddMore}
              className="w-full"
            >
              <Icon name="Plus" size="16" className="mr-2" />
              Add Another Item
            </Button>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Icon
                      name="Loader"
                      size="16"
                      className="mr-2 animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icon name="Save" size="16" className="mr-2" />
                    {items.length > 1 ? "Save Items" : "Save Item"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 dark:bg-red-950">
              <div className="flex items-center">
                <Icon
                  name="AlertCircle"
                  className="mr-2 text-red-500"
                  size="16"
                />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewPackingItemModal;
