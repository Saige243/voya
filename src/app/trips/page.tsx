import { api } from "~/trpc/server";
import TripCard from "./_components/TripCard";

export default async function Trips() {
  const trips = await api.trip.getAll();

  const MappedTrips = trips.map((trip) => {
    return <TripCard key={trip.id} {...trip} />;
  });

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex justify-center">
        <h1>My Trips</h1>
      </div>
      <div className="flex flex-wrap justify-center gap-4 p-8">
        {MappedTrips}
      </div>
    </main>
  );
}
