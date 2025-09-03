import { getServerAuthSession } from "~/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "~/_components/ui/avatar";
import { Card } from "~/_components/ui/card";
import { CardContent } from "~/_components/ui/card";
import { Label } from "~/_components/ui/label";

async function Profile() {
  const session = await getServerAuthSession();
  const firstName = session?.user?.name?.split(" ")[0];
  const lastName = session?.user?.name?.split(" ")[1];

  return (
    <main className="flex min-h-screen flex-col place-items-center pt-32 text-white">
      <Card className="w-fit">
        <CardContent>
          <div className="flex w-full justify-center pb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage alt="avatar" src={session?.user.image ?? ""} />
              <AvatarFallback className="text-sm">
                {firstName?.charAt(0)}
                {lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
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
