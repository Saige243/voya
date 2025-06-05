"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import React, { useEffect, useRef } from "react";
import getTrip from "~/app/trips/actions/getTrip";
import { Typography } from "../common/Typography";
import { Card, CardContent } from "../ui/card";
import formatStartAndEndDates from "~/utils/formatStartandEndDates";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";

function DailyItinerary() {
  const params = useParams();
  const tripId = params.id as string;
  type Trip = Awaited<ReturnType<typeof getTrip>>;
  const [trip, setTrip] = React.useState<Trip | null>(null);

  const dayIndex = parseInt(params.index as string) - 1;

  const dateRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    async function fetchTrip() {
      const data = await getTrip(tripId);
      setTrip(data);
    }

    if (tripId) {
      fetchTrip().catch(console.error);
    }
  }, [tripId]);

  useEffect(() => {
    if (dayIndex >= 0 && dateRefs.current[dayIndex]) {
      dateRefs.current[dayIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [dayIndex, trip]);

  const startDate = trip?.startDate ? new Date(trip.startDate) : new Date();
  const endDate = trip?.endDate ? new Date(trip.endDate) : new Date();
  const dates = formatStartAndEndDates(startDate, endDate);

  const itineraryDaysAccordion = (
    <div className="w-full">
      <Accordion defaultChecked type="single" collapsible className="w-full">
        <AccordionItem
          value="daily-itinerary"
          className="cursor-pointer border-none"
        >
          <AccordionTrigger className="flex min-w-48 items-center justify-between space-x-2 [&>svg]:text-white">
            <span className="text-base">Daily Itinerary</span>
          </AccordionTrigger>

          <AccordionContent className="flex flex-col">
            {dates.map((date, index) => {
              const formattedDate = format(date, "EEE, MMMM d");
              return (
                <Button
                  variant="ghost"
                  key={index}
                  className="w-full justify-start text-left text-sm"
                  onClick={() => {
                    dateRefs.current[index]?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  <span className="mr-2 text-gray-400">Day {index + 1}:</span>
                  <span>{formattedDate}</span>
                </Button>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="flex flex-col">
      <div>
        <Typography variant="heading2" className="text-black dark:text-white">
          Daily Itinerary
        </Typography>
        <Typography className="pb-2 text-gray-600 dark:text-gray-400">
          {dates.length} day{dates.length > 1 ? "s" : ""}
        </Typography>
      </div>
      <div className="flex flex-row justify-between">
        <div>{itineraryDaysAccordion}</div>
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
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DailyItinerary;
