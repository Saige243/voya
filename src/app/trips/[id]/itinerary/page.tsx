"use client";

import { Typography } from "~/_components/common/Typography";
import formatStartAndEndDates from "~/utils/formatStartandEndDates";
import { useTrip } from "~/app/trips/contexts/TripContext";
import { redirect } from "next/navigation";
import DailyItineraryAccordion from "~/app/trips/[id]/itinerary/_components/ItineraryAccordion";

export default function ItineraryPage() {
  const { trip } = useTrip();

  if (!trip) {
    redirect("/");
  }

  const startDate = trip?.startDate ? new Date(trip.startDate) : new Date();
  const endDate = trip?.endDate ? new Date(trip.endDate) : new Date();
  const dates = formatStartAndEndDates(startDate, endDate);

  return (
    <div>
      <div className="mb-4">
        <Typography variant="heading2" className="text-black dark:text-white">
          Daily Itinerary
        </Typography>
        <Typography className="pb-2 pl-2 text-gray-700 dark:text-gray-400">
          {dates.length} day{dates.length > 1 ? "s" : ""}
        </Typography>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-3/4">
          <DailyItineraryAccordion trip={trip} />
        </div>
      </div>
    </div>
  );
}
