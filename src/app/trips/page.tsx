import { api } from "~/trpc/server";
import TripCard from "../_components/trips/TripCard";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Button } from "~/app/_components/common/Button";

export default async function Trips() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const trips = await api.trip.getAll();
  const MappedTrips = trips.map((trip) => {
    return <TripCard key={trip.id} {...trip} />;
  });

  return (
    <main className="flex min-h-screen flex-col">
      <h1 className="pb-20 text-center">My Trips:</h1>
      {trips.length > 0 ? (
        <>
          <div className="flex justify-center">
            <h1>My Trips</h1>
          </div>
          <div className="flex flex-wrap justify-center gap-4 p-8">
            {MappedTrips}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p>You have no trips yet!</p>
          <a href="/trips/new">
            <Button>Create a trip</Button>
          </a>
        </div>
      )}
    </main>
  );
}
