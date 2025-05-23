import { getServerAuthSession } from "~/server/auth";
import Avatar from "~/app/_components/common/Avatar";
import { Popover, PopoverContent } from "~/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "~/components/ui/button";
import { signOut } from "next-auth/react";

async function Profile() {
  const session = await getServerAuthSession();
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <main className="flex min-h-screen flex-col place-items-center pt-32 text-white">
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
    </main>
  );
}

export default Profile;
