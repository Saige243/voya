import { getServerAuthSession } from "~/server/auth";
import { Card } from "~/app/_components/ui/Card";
import Avatar from "~/app/_components/ui/Avatar";

async function Profile() {
  const session = await getServerAuthSession();
  console.log("SESSION: ", session);
  return (
    <main className="flex min-h-screen flex-col place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-6 pt-40 text-white">
      <Card
        title="Profile"
        description="Set your profile information here"
        className="text-black"
      >
        <div className="flex flex-col items-center pb-4">
          <Avatar
            alt="avatar"
            image={session?.user.image ?? ""}
            width={32}
            height={32}
          />
        </div>
        <div>
          <div className="flex flex-row gap-2">
            <div>
              <p className="text-gray-400">Name:</p>
            </div>
            <div>
              <p className="text-black">{session?.user?.name}</p>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div>
              <p className="text-gray-400">Email:</p>
            </div>
            <div>
              <p className="text-black">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}

export default Profile;
