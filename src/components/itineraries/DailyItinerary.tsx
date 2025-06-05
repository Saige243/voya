"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import React, { useCallback, useEffect, useRef } from "react";
import getTrip from "~/app/trips/actions/getTrip";
import { Typography } from "../common/Typography";
import formatStartAndEndDates from "~/utils/formatStartandEndDates";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import DailyItineraryCard from "./DailyItineraryCard";

function DailyItinerary() {
  const params = useParams();
  const tripId = params.id as string;
  type Trip = Awaited<ReturnType<typeof getTrip>>;
  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const dayIndex = parseInt(params.index as string) - 1;

  const dateRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleRefSet = useCallback(
    (index: number, ref: HTMLDivElement | null) => {
      dateRefs.current[index] = ref;
    },
    [],
  );

  useEffect(() => {
    async function fetchTrip() {
      try {
        setIsLoading(true);
        const data = await getTrip(tripId);
        setTrip(data);
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (tripId) {
      fetchTrip().catch(console.error);
    }
  }, [tripId]);

  useEffect(() => {
    if (dayIndex >= 0 && dateRefs.current[dayIndex] && !isLoading) {
      dateRefs.current[dayIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [dayIndex, trip, isLoading]);

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

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm dark:bg-black/50">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div>
        <Typography variant="heading2" className="text-black dark:text-white">
          Daily Itinerary
        </Typography>
        <Typography className="pb-2 text-gray-700 dark:text-gray-400">
          {dates.length} day{dates.length > 1 ? "s" : ""}
        </Typography>
      </div>
      <div className="flex flex-row justify-around">
        <div>{itineraryDaysAccordion}</div>
        <div className="flex flex-col space-y-4">
          {dates.map((date, i) => (
            <DailyItineraryCard
              key={i}
              date={date}
              i={i}
              onRefSet={handleRefSet}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DailyItinerary;
