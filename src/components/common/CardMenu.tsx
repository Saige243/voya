import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Icon } from "~/components/common/Icon";
import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";

export default function CardMenu({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-2">
          <Icon
            name="EllipsisVertical"
            className="text-black dark:text-white"
            size="20"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-fit flex-col p-2">
        {children}
      </PopoverContent>
    </Popover>
  );
}
