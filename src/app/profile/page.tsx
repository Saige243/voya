import { getServerAuthSession } from "~/server/auth";
import { Card } from "~/app/_components/common/Card";
import Avatar from "~/app/_components/common/Avatar";

async function Profile() {
  const session = await getServerAuthSession();
  console.log("SESSION: ", session);
  return (
    <main className="flex min-h-screen flex-col place-items-center p-6 pt-32 text-white">
      <Card
        title="Profile"
        description="Set your profile information here"
        className="text-black"
      >
        <div className="flex flex-col items-center pb-12">
          <Avatar
            alt="avatar"
            image={session?.user.image ?? ""}
            width={40}
            height={40}
          />
        </div>
        <div>
          <div className="flex flex-row gap-2">
            <div>
              <p className="text-gray-400">Name:</p>
            </div>
            <div>
              <p>{session?.user?.name}</p>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div>
              <p className="text-gray-400">Email:</p>
            </div>
            <div>
              <p>{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}

export default Profile;
