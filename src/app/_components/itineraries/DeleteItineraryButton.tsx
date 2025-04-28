"use client";

import { useTransition } from "react";
import { Button, IconButton } from "~/app/_components/common/OldButton";
import { Icon } from "~/app/_components/common/Icon";
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
    <IconButton
      onClick={handleDelete}
      disabled={isPending}
      className="border-none bg-transparent"
    >
      <Icon name="Trash" color={isPending ? "gray" : "red"} size="20" />
    </IconButton>
  );
}
