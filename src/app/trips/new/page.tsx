import { getServerAuthSession } from "~/server/auth";
import NewTripForm from "~/app/trips/_components/NewTripForm";
import { redirect } from "next/navigation";

export default async function NewTrip() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }

  if (!session?.user) return null;

  return (
    <main className="flex min-h-screen flex-col place-items-center bg-gradient-to-b p-6 text-white">
      <NewTripForm userId={session.user.id} />
    </main>
  );
}
