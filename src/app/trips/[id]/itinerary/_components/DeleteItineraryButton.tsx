"use client";

import { useTransition } from "react";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/common/Icon";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

type DeleteItineraryButtonProps = {
  id: number;
};

export function DeleteItineraryButton({ id }: DeleteItineraryButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deleteAccommodation = api.itinerary.delete.useMutation({
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
    },
    onError: (error) => {
      console.error("Error deleting accommodation", error);
    },
  });

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this itinerary?",
    );
    if (confirmed) {
      deleteAccommodation.mutate({ id });
    }
  };

  return (
    <Button onClick={handleDelete} disabled={isPending} variant="ghost">
      <Icon name="Trash" color={isPending ? "gray" : "red"} size="20" />
      <span className="text-red-500">Delete Itinerary</span>
    </Button>
  );
}
