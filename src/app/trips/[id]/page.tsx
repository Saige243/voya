"use client";

import { Button } from "~/_components/ui/button";
import { type Accommodation } from "@prisma/client";
import DailyItineraryCard from "./itinerary/_components/ItineraryAccordion";
import PackingList from "./packing-list/_components/PackingList";
import TripDetailsCard from "./itinerary/_components/TripDetailsCard";
import AccommodationsCard from "./itinerary/_components/AccommodationsCard";
import { api } from "~/trpc/react";
import { Skeleton } from "~/_components/ui/skeleton";

type AccommodationListProps = {
  accommodations: Accommodation[];
  tripId: number;
};

export default function TripDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: trip, isLoading: tripLoading } = api.trip.getById.useQuery({
    id: parseInt(params.id),
  });
  const { data: accommodations, isLoading: accommodationsLoading } =
    api.accommodation.getAll.useQuery({
      tripId: parseInt(params.id),
    });

  if (tripLoading) {
    return (
      <main className="min-h-screen">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 ">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-32 w-full rounded-2xl" />

            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-52 w-full rounded-2xl" />
            ))}

            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>

          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </main>
    );
  }

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

    if (accommodationsLoading) {
      return (
        <div className="w-full space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-96 w-full rounded-2xl" />
          ))}
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

  if (!trip) {
    return <div>Trip not found</div>;
  }

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
