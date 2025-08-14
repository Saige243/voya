import React from "react";
import getPackingList from "../../actions/getPackingList";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type PackingList } from "@prisma/client";

type Props = {
  params: { id?: string };
};

async function PackingListPage({ params }: Props) {
  const tripId = params.id;

  if (!tripId || tripId === "undefined" || tripId === "null") {
    redirect("/");
  }

  let list: PackingList[] = [];

  try {
    list = await getPackingList(tripId);
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

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Packing List</h1>
      {list.length === 0 && emptyList}
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
