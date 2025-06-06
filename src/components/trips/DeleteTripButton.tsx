"use client";

import { useTransition } from "react";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/common/Icon";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";

type DeleteTripButtonProps = {
  id: number;
};

export function DeleteTripButton({ id }: DeleteTripButtonProps) {
  const [isPending, startTransition] = useTransition();

  const deleteTrip = api.trip.delete.useMutation({
    onSuccess: () => {
      startTransition(() => {
        redirect("/trips");
      });
    },
    onError: (error) => {
      console.error("Error deleting trip", error);
    },
  });

  const handleDelete = async () => {
    const confirmed = window.prompt(
      "Are you sure you want to delete this trip and its associated data? This action cannot be undone. Type 'DELETE TRIP' to confirm.",
    );
    if (confirmed !== "DELETE TRIP") {
      return;
    }
    try {
      deleteTrip.mutate(id);
    } catch (error) {
      console.error("Error deleting trip", error);
    }
  };

  return (
    <Button onClick={handleDelete} disabled={isPending} variant="ghost">
      <Icon name="Trash" color={isPending ? "gray" : "red"} size="20" />
      <span className="text-red-500">Delete Trip</span>
    </Button>
  );
}
