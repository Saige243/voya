"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Icon } from "~/app/_components/common/Icon";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()}>
      <Icon
        name="ArrowBigLeft"
        size="35"
        className="text-white dark:text-white"
      />
    </Button>
  );
}
