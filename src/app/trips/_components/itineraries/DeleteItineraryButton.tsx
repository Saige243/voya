"use client";

import { useTransition } from "react";
import { Button } from "~/app/_components/ui/Button";
import { Icon } from "~/app/_components/ui/Icon";
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
    deleteAccommodation.mutate({ id: id });
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isPending}
      className="border-none bg-transparent"
    >
      <Icon name="Trash" color={isPending ? "gray" : "red"} size="20" />
    </Button>
  );
}
