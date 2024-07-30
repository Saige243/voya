import { api } from "~/trpc/server";
import { Button } from "../../_components/Button";

export default async function TripShowcase() {
  const trips = await api.trip.getAll();
  const upcomingTrip = trips[0];

  return (
    <div className="w-full max-w-xs">
      {trips.length ? (
        <>
          <p className="truncate">Your next trip: {upcomingTrip?.title}</p>
          <a href={`/trips/${upcomingTrip?.id}`}>
            <Button>{upcomingTrip?.title}</Button>
          </a>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p>You have no trips yet!</p>
          <a href="/trips/new">
            <Button>Create a trip</Button>
          </a>
        </div>
      )}
    </div>
  );
}
