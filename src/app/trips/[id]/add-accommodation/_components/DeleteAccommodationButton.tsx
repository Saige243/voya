"use client";

import { useTransition } from "react";
import { Icon } from "~/_components/common/Icon";
import { Button } from "~/_components/ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

type DeleteAccommodationButtonProps = {
  accId: number;
};

export function DeleteAccommodationButton({
  accId,
}: DeleteAccommodationButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const deleteAccommodation = api.accommodation.delete.useMutation({
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
      "Are you sure you want to delete this accommodation?",
    );
    if (confirmed) {
      deleteAccommodation.mutate({ id: accId });
    }
  };

  return (
    <Button onClick={handleDelete} disabled={isPending} variant="ghost">
      <Icon name="Trash" color={isPending ? "gray" : "red"} size="20" />
      <span className="text-red-500">Delete Accommodation</span>
    </Button>
  );
}
