"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import React, { useEffect } from "react";
import getTrip from "~/app/trips/actions/getTrip";
import { Typography } from "../common/Typography";
import { Card, CardContent } from "../ui/card";

function DailyItinerary() {
  type Trip = Awaited<ReturnType<typeof getTrip>>;
  const [trip, setTrip] = React.useState<Trip | null>(null);
  const params = useParams();
  const tripId = params.id as string;

  function formatTripDates(startDate: Date, endDate: Date) {
    const date = new Date(startDate);
    const dates: Date[] = [];

    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  useEffect(() => {
    async function fetchTrip() {
      const data = await getTrip(tripId);
      setTrip(data);
    }

    if (tripId) {
      fetchTrip().catch(console.error);
    }
  }, [tripId]);
  const startDate = trip?.startDate ? new Date(trip.startDate) : new Date();
  const endDate = trip?.endDate ? new Date(trip.endDate) : new Date();
  const dates = formatTripDates(startDate, endDate);
  return (
    <div>
      <div>
        <Typography variant="heading2" className="text-black dark:text-white">
          Daily Itinerary
        </Typography>
        <Typography className="pb-2 text-gray-600 dark:text-gray-400">
          {dates.length} day{dates.length > 1 ? "s" : ""}
        </Typography>
      </div>
      <div className="flex flex-col space-y-4">
        {dates.map((date) => (
          <Card key={date.toISOString()}>
            <CardContent>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
              >
                <AccordionItem value={date.toISOString()}>
                  <AccordionTrigger>
                    {format(date, "EEE, MMMM d")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <Typography className="text-gray-600 dark:text-gray-400">
                      No itinerary planned for this day.
                    </Typography>
                  </AccordionContent>
                </AccordionItem>
                {/* <ItineraryBlock trip={trip} itineraries={trip.itineraries} /> */}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DailyItinerary;
