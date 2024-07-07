import { getServerAuthSession } from "~/server/auth";
import { Card } from "~/app/_components/Card";
import Avatar from "~/app/_components/Avatar";

async function Profile() {
  const session = await getServerAuthSession();
  console.log("SESSION: ", session);
  return (
    <div>
      profile
      <div>session</div>
      <Card title="profile" description={""}>
        <div>
          <Avatar alt="avatar" image={session?.user.image ?? ""} width={24} />
          <div>
            <div>name</div>
            <div>{session?.user?.name}</div>
          </div>
          <div>
            <div>email</div>
            <div>{session?.user?.email}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Profile;
