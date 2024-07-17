import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Button } from "~/app/_components/Button";

export default async function NewTrip() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const trips = await api.trip.getAll();

  return (
    <main className="flex min-h-screen flex-col place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-6 text-white">
      <div className="w-full max-w-xs">
        {trips.length ? (
          <p className="truncate">Your most recent trip: {trips[0]?.title}</p>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p>You have no trips yet!</p>
            <a href="/trips/new">
              <Button>Create a trip</Button>
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
