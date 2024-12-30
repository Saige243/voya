"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/app/_components/common/Button";
import { Icon } from "~/app/_components/common/Icon";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()}>
      <Icon name="ArrowBigLeft" size="25" />
    </Button>
  );
}
