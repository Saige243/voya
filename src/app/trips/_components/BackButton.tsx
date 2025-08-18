"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/_components/ui/button";
import { Icon } from "~/_components/common/Icon";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant="ghost">
      <Icon
        name="ChevronLeft"
        size="75"
        className="text-white dark:text-white"
      />
    </Button>
  );
}
