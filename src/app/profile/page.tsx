import { getServerAuthSession } from "~/server/auth";
import Avatar from "~/app/_components/common/Avatar";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";

async function Profile() {
  const session = await getServerAuthSession();
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <main className="flex min-h-screen flex-col place-items-center pt-32 text-white">
      <Card>
        <CardContent>
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
          <div className="flex flex-col gap-2">
            <a href="/profiled" className="hover:cursor text-sm text-gray-500">
              Profile
            </a>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default Profile;
