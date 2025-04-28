"use client";

import { useRouter } from "next/navigation";
import { IconButton } from "~/app/_components/common/OldButton";
import { Icon } from "~/app/_components/common/Icon";

export default function BackButton() {
  const router = useRouter();

  return (
    <IconButton onClick={() => router.back()}>
      <Icon
        name="ArrowBigLeft"
        size="35"
        className="text-white dark:text-white"
      />
    </IconButton>
  );
}
