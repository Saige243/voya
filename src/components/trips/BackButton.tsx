"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/common/Icon";

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
