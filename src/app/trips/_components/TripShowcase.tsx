import { api } from "~/trpc/server";
import { Button } from "../../_components/Button";

export default async function TripShowcase() {
  const trips = await api.trip.getAll();

  return (
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
  );
}
