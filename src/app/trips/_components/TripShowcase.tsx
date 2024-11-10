import { api } from "~/trpc/server";
import { Button } from "../../_components/ui/Button";
import TripCard from "./TripCard";

export default async function TripShowcase() {
  const trips = await api.trip.getAll();
  const upcomingTrip = trips[0];
  console.log("upcomingTrip", upcomingTrip);

  return (
    <div className="flex w-full max-w-xs justify-center">
      {upcomingTrip ? (
        <div className="flex flex-col">
          <h2 className="pb-4 text-center text-xl font-bold">
            Your Upcoming Trip:
          </h2>
          <TripCard {...upcomingTrip} />
        </div>
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
