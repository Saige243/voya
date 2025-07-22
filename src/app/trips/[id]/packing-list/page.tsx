import React from "react";
import getPackingList from "../../actions/getPackingList";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: { id?: string };
};

async function PackingListPage({ params }: Props) {
  const tripId = params.id;
  console.log("Trip ID:", tripId);

  if (!tripId || tripId === "undefined" || tripId === "null") {
    redirect("/");
  }
  console.log("Fetching packing list for trip ID:", tripId, params);

  try {
    const list = await getPackingList(tripId);
    console.log("Fetched packing list:", list);
  } catch (error) {
    console.warn("Error fetching packing list:", error);
  }

  const emptyList = (
    <div>
      <p className="text-gray-500">Your packing list is empty.</p>
      <p className="text-gray-500">Click the button below to add items.</p>
      <Button className="btn btn-primary mt-4">Add Item</Button>
    </div>
  );

  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Packing List</h1>
      <p className="text-gray-500">
        This is where you can manage your packing list.
      </p>
      <Link
        className={cn(
          buttonVariants({ variant: "link" }),
          "no-underline hover:no-underline",
        )}
        href={`/trips/${tripId}/packing-list/add-item`}
      >
        Add Item
      </Link>
    </main>
  );
}

export default PackingListPage;
