"use client";

import { useTransition } from "react";
import { Button } from "~/app/_components/ui/Button";
import { Icon } from "~/app/_components/ui/Icon";
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
    deleteAccommodation.mutate({ id: accId });
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isPending || deleteAccommodation.isLoading}
      className="border-none bg-transparent"
    >
      <Icon name="Trash" color={isPending ? "gray" : "red"} size="20" />
    </Button>
  );
}
