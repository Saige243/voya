import { getServerAuthSession } from "~/server/auth";
import Avatar from "~/app/_components/common/Avatar";
import { Card } from "~/components/ui/card";
import { CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";

async function Profile() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col place-items-center pt-32 text-white">
      <Card className="w-fit">
        <CardContent>
          <div className="flex w-full justify-center pb-4">
            <Avatar
              alt="avatar"
              image={session?.user.image ?? ""}
              width={36}
              height={36}
            />
          </div>
          <div>
            <Label>Name:</Label>
            <p>{session?.user.name}</p>
            <Label>Email:</Label>
            <p>{session?.user.email}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default Profile;
