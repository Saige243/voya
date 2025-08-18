import React from "react";
import getPackingList from "../../actions/getPackingList";
import { Button, buttonVariants } from "~/_components/ui/button";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type PackingListItem } from "@prisma/client";
import { Checkbox } from "~/_components/ui/checkbox";
import { Label } from "~/_components/ui/label";

type Props = {
  params: { id?: string };
};

async function PackingListPage({ params }: Props) {
  const tripId = params.id;

  if (!tripId || tripId === "undefined" || tripId === "null") {
    redirect("/");
  }

  let listItems: PackingListItem[] = [];

  try {
    const list = await getPackingList(tripId);
    listItems = list.items;
    console.log("Fetched packing list:", list);
  } catch (error) {
    console.warn("Error fetching packing list:", error);
  }

  const emptyList = (
    <div className="text-center">
      <p className="text-gray-500">Your packing list is empty.</p>
      <p className="text-gray-500">Click the button below to add items.</p>
    </div>
  );

  const listView = (
    <div className="w-full">
      <ul>
        <div className="m-2 flex flex-row items-center justify-between rounded-md p-2 text-black">
          <Label>Item</Label>
          <Label>Packed?</Label>
        </div>
        {listItems.map((li) => (
          <li
            key={li.id}
            className="m-2 flex flex-row items-center justify-between rounded-md bg-white p-2 text-black"
          >
            <p className="px-2">
              {li.name}{" "}
              <span className="text-sm text-gray-500">(x{li.quantity})</span>
            </p>
            <div>
              <Checkbox
                className="border-black"
                id={`packed-${li.name}`}
                checked={li.isPacked}
                // onCheckedChange={(checked) =>
                //   handleItemChange(index, "isPacked", checked === true)
                // }
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Packing List</h1>
      {listItems.length === 0 && emptyList}
      {listItems.length > 0 && listView}
      <Button className="btn btn-primary my-4" asChild>
        <Link
          className={cn(
            buttonVariants({ variant: "link" }),
            "mt-4 no-underline hover:no-underline",
          )}
          href={`/trips/${tripId}/packing-list/add-item`}
        >
          Add Item
        </Link>
      </Button>
    </main>
  );
}

export default PackingListPage;
