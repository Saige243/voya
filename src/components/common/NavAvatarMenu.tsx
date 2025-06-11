"use client";

// import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
// import { PopoverTrigger } from "@radix-ui/react-popover";
// import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";

function NavAvatarMenu() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0];
  const lastName = session?.user?.name?.split(" ")[1];

  return (
    <>
      {/* <Button
        variant="secondary"
        className="flex items-center gap-2  p-5 px-2 text-gray-700 shadow-md"
      > */}
      <div className="flex items-center py-3">
        <Avatar className="h-8 w-8">
          <AvatarImage alt="avatar" src={session?.user.image ?? ""} />
          <AvatarFallback className="text-sm">
            {firstName?.charAt(0)}
            {lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div>
        <p>{firstName}</p>
      </div>
      {/* </Button> */}
      {/* <div className="flex flex-col gap-1">
        <a
          href="/profile"
          className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Profile
        </a>
        <button
          onClick={() => signOut()}
          className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div> */}
    </>
  );
}

export default NavAvatarMenu;
