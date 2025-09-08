import { Button } from "~/_components/ui/button";
import { Icon } from "~/_components/common/Icon";
import { type Trip, type Accommodation } from "@prisma/client";
import { redirect } from "next/navigation";
import getTrip from "../actions/getTrip";
import getAccommodations from "../actions/getAccommodations";
import DailyItineraryCard from "./itinerary/_components/DailyItineraryAccordion";
import PackingList from "./packing-list/_components/PackingList";
import TripDetailsCard from "./itinerary/_components/TripDetailsCard";
import AccommodationsCard from "./itinerary/_components/AccommodationsCard";

type AccommodationListProps = {
  accommodations: Accommodation[];
  tripId: number;
};

export default async function TripDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  let trip: Trip | null = null;
  let accommodations: Accommodation[] = [];

  try {
    trip = await getTrip(params.id);
    accommodations = await getAccommodations(params.id);
  } catch (error) {
    console.error(error);
    redirect("/trips");
  }

  if (!trip) redirect("/trips");

  const AccommodationList = ({
    accommodations,
    tripId,
  }: AccommodationListProps) => {
    if (accommodations.length === 0) {
      return (
        <div className="text-center">
          <p className="text-gray-600">No accommodations!</p>
          <Button variant="default">
            <a href={`/trips/${tripId}/add-accommodation`}>Add Accommodation</a>
          </Button>
        </div>
      );
    }

    return (
      <div className="w-full space-y-4">
        {accommodations.map((acc) => (
          <AccommodationsCard
            key={acc.id}
            accommodation={acc}
            tripId={tripId}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
        <div className="flex flex-col gap-4">
          <TripDetailsCard trip={trip} />
          <AccommodationList tripId={trip.id} accommodations={accommodations} />
          <PackingList
            params={{
              id: trip.id,
            }}
          />
        </div>
        {trip && (
          <div className="w-full">
            <DailyItineraryCard trip={trip} />
          </div>
        )}
      </div>
    </main>
  );
}
