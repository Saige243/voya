"use client";

import { Button } from "~/_components/ui/button";
import { type Accommodation } from "@prisma/client";
import DailyItineraryCard from "./itinerary/_components/DailyItineraryAccordion";
import PackingList from "./packing-list/_components/PackingList";
import TripDetailsCard from "./itinerary/_components/TripDetailsCard";
import AccommodationsCard from "./itinerary/_components/AccommodationsCard";
import { api } from "~/trpc/react";

type AccommodationListProps = {
  accommodations: Accommodation[];
  tripId: number;
};

export default function TripDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: trip, isLoading } = api.trip.getById.useQuery({
    id: parseInt(params.id),
  });
  const { data: accommodations } = api.accommodation.getAll.useQuery({
    tripId: parseInt(params.id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

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
          <AccommodationList
            tripId={trip.id}
            accommodations={accommodations ?? []}
          />
          <PackingList
            params={{
              id: trip.id,
            }}
          />
        </div>
        <DailyItineraryCard trip={trip} />
      </div>
    </main>
  );
}
