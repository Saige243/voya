"use client";

import { signOut } from "next-auth/react";
import Avatar from "~/app/_components/common/Avatar";
import { Popover, PopoverContent } from "~/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";

function NavAvatarMenu() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center gap-2 p-2 px-2 text-black"
        >
          <Avatar
            alt="avatar"
            image={session?.user.image ?? ""}
            width={20}
            height={20}
          />
          <div>
            <p>{firstName}</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <a href="/profiled" className="hover:cursor text-sm text-gray-500">
            Profile
          </a>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NavAvatarMenu;
