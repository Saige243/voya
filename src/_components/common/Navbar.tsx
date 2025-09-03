"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/_components/ui/popover";
import { Button } from "~/_components/ui/button";
import NavAvatarMenu from "./NavAvatarMenu";

export default function Navbar() {
  const menuPopover = (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-2 px-2 text-base"
        >
          Menu
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-40 flex-col p-2">
        <a
          href="/trips"
          className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          My Trips
        </a>
        <a
          href="/settings"
          className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Settings
        </a>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="navbar flex items-center justify-center">
      <div className="flex-1 lg:flex-none">
        <a href="/dashboard" className="text-lg font-bold">
          Voya
        </a>
      </div>
      <div className="flex flex-1 items-center justify-end px-2">
        <div className="flex items-stretch gap-8">
          {menuPopover}
          <div className="flex items-center">
            <NavAvatarMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
