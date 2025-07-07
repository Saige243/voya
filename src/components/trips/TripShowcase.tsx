import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import TripCard from "./TripCard";
import getAllSortedTrips from "~/app/trips/actions/getAllSortedTrips";

export default async function TripShowcase() {
  const sortedTrips = await getAllSortedTrips();
  const upcomingTrip = sortedTrips[0];
  console.log("upcomingTrip", upcomingTrip);

  return (
    <div className="flex w-full max-w-xs justify-center">
      {upcomingTrip ? (
        <div className="flex flex-col">
          <h2 className="pb-4 text-center text-xl font-bold">
            Your Upcoming Trip:
          </h2>
          <div className="pt-20">
            <TripCard {...upcomingTrip} />
          </div>
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
