"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/app/_components/ui/Button";
import { Icon } from "~/app/_components/ui/Icon";
import { api } from "~/trpc/server";
import { useTransition } from "react";

type DeleteAccommodationButtonProps = {
  accId: number;
};

export function DeleteAccommodationButton({
  accId,
}: DeleteAccommodationButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (accId: number) => {
    try {
      await api.accommodation.delete({ id: accId });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Error deleting accommodation", error);
    }
  };

  return (
    <Button
      onClick={() => handleDelete(accId)}
      disabled={isPending}
      className="border-none bg-transparent"
    >
      <Icon name="Trash" color={isPending ? "gray" : "red"} size="20" />
    </Button>
  );
}
