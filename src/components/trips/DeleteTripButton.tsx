"use client";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/common/Icon";
import { api } from "~/trpc/react";

type DeleteTripButtonProps = {
  id: number;
};

export function DeleteTripButton({ id }: DeleteTripButtonProps) {
  const deleteTrip = api.trip.delete.useMutation({
    onSuccess: () => {
      console.log("Trip deleted successfully");

      window.location.href = "/trips";
    },
    onError: (error) => {
      console.error("Error deleting trip:", error);
    },
  });

  const handleDelete = async () => {
    const confirmed = window.prompt(
      "Are you sure you want to delete this trip and its associated data? This action cannot be undone. Type 'DELETE TRIP' to confirm.",
    );

    if (confirmed !== "DELETE TRIP") {
      return;
    }

    deleteTrip.mutate(id);
  };

  return (
    <Button onClick={handleDelete} variant="ghost">
      <Icon name="Trash" color="red" size="20" />
      <span className="text-red-500">Delete Trip</span>
    </Button>
  );
}
