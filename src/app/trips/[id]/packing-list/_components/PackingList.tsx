"use client";

import React from "react";
import { redirect } from "next/navigation";
import { Checkbox } from "~/_components/ui/checkbox";
import { api } from "~/trpc/react";
import { Skeleton } from "~/_components/ui/skeleton";
import { Card, CardContent } from "~/_components/ui/card";
import { Icon } from "~/_components/common/Icon";
import { Typography } from "~/_components/common/Typography";
import NewPackingItemModal from "./NewPackingItemModal";

type Props = {
  params: { id?: number };
};

function PackingList({ params }: Props) {
  const tripId = params.id ? Number(params.id) : undefined;
  const utils = api.useUtils();

  if (!tripId || isNaN(tripId)) {
    redirect("/");
  }

  const { data, isLoading } = api.packingList.getById.useQuery(
    { tripId, include: { items: true } },
    { enabled: !!tripId },
  );

  const updateItem = api.packingList.updateItem.useMutation({
    onSuccess: () => {
      void utils.packingList.getById.invalidate({ tripId });
    },
  });

  const handleItemAdded = () => {
    void utils.packingList.getById.invalidate({ tripId });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-1/6" />
      </div>
    );
  }

  const listItems = data?.items ?? [];
  const packedListItems = listItems.filter((i) => i.isPacked);
  const unpackedListItems = listItems.filter((i) => !i.isPacked);
  const totalItems = listItems.length;
  const packedCount = packedListItems.length;
  const progressPercentage =
    totalItems > 0 ? (packedCount / totalItems) * 100 : 0;

  const emptyList = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon name="Luggage" className="mb-4 text-gray-400" size="48" />
      <Typography className="mb-2 text-lg font-semibold text-gray-600">
        No items to pack yet
      </Typography>
      <Typography className="mb-6 text-gray-500">
        Start building your packing list by adding items below
      </Typography>
      <NewPackingItemModal tripId={tripId} onConfirm={handleItemAdded} />
    </div>
  );

  const PackingItem = ({ item }: { item: (typeof listItems)[0] }) => (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        item.isPacked
          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      }`}
    >
      <CardContent className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <Checkbox
            id={`packed-${item.id}`}
            checked={item.isPacked}
            onCheckedChange={(checked) =>
              updateItem.mutate({
                id: item.id,
                isPacked: checked === true,
              })
            }
            className="h-5 w-5"
          />
          <div className="flex-1">
            <Typography
              className={`font-medium ${
                item.isPacked
                  ? "text-gray-500 line-through"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {item.name}
            </Typography>
            <Typography className="text-sm text-gray-500">
              Quantity: {item.quantity}
            </Typography>
          </div>
        </div>
        {item.isPacked && (
          <Icon name="CircleCheck" className="text-green-500" size="20" />
        )}
      </CardContent>
    </Card>
  );

  const listView = (
    <div className="w-full space-y-6">
      {/* Progress Summary */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-950 dark:to-indigo-950">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center">
            <Icon name="Luggage" className="mr-2 text-blue-600" size="20" />
            <Typography className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Packing Progress
            </Typography>
          </span>
          <Typography className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {packedCount} of {totalItems} packed
          </Typography>
        </div>
        <div className="h-3 w-full rounded-full bg-blue-200 dark:bg-blue-800">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="mt-2 flex justify-between text-sm text-blue-600 dark:text-blue-400">
          <span>0%</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Unpacked Items */}
      {unpackedListItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 px-4 py-3 dark:from-orange-950 dark:to-red-950">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <Icon name="List" className="text-orange-600" size="16" />
            </div>
            <Typography className="text-lg font-semibold text-orange-900 dark:text-orange-100">
              Need to Pack ({unpackedListItems.length})
            </Typography>
          </div>
          <div className="space-y-2 pl-2">
            {unpackedListItems.map((item) => (
              <PackingItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Packed Items */}
      {packedListItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 dark:from-green-950 dark:to-emerald-950">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Icon name="CircleCheck" className="text-green-600" size="16" />
            </div>
            <Typography className="text-lg font-semibold text-green-900 dark:text-green-100">
              Packed ({packedListItems.length})
            </Typography>
          </div>
          <div className="space-y-2 pl-2">
            {packedListItems.map((item) => (
              <PackingItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Add Item Button */}
      <div className="flex justify-center pt-4">
        <NewPackingItemModal tripId={tripId} onConfirm={handleItemAdded} />
      </div>
    </div>
  );

  return (
    <Card className="mx-auto w-full max-w-4xl p-6">
      {listItems.length === 0 && emptyList}
      {listItems.length > 0 && listView}
    </Card>
  );
}

export default PackingList;
