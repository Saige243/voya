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
import { Typography } from "../common/Typography";
import formatStartAndEndDates from "~/utils/formatStartandEndDates";
import { Button } from "../ui/button";
import DailyItineraryCard from "./DailyItineraryCard";
import { useTrip } from "~/app/trips/contexts/TripContext";
import getItineraries from "~/app/trips/actions/getItineraries";
import { type Itinerary } from "@prisma/client";
import { Card } from "../ui/card";

function DailyItinerary() {
  const params = useParams();
  const { trip } = useTrip();
  const [itineraries, setItineraries] = React.useState<Itinerary[]>([]);
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const dayIndex = parseInt(params.index as string) - 1;

  const dateRefs = useRef<(HTMLDivElement | null)[]>([]);

  function toArray<T>(item: T | T[] | null | undefined): T[] {
    return item == null ? [] : Array.isArray(item) ? item : [item];
  }

  const handleRefSet = useCallback(
    (index: number, ref: HTMLDivElement | null) => {
      dateRefs.current[index] = ref;
    },
    [],
  );

  useEffect(() => {
    if (dayIndex >= 0 && dateRefs.current[dayIndex]) {
      dateRefs.current[dayIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [dayIndex, trip]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const tripId = trip?.id;
        if (tripId) {
          const itineraries = await getItineraries(tripId.toString());
          if (!itineraries) {
            console.error(`No itineraries found for trip ID ${tripId}`);
          }
          setItineraries(toArray(itineraries));
        } else {
          console.error("Trip ID is not available");
        }
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    void fetchItineraries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip]);

  const startDate = trip?.startDate ? new Date(trip.startDate) : new Date();
  const endDate = trip?.endDate ? new Date(trip.endDate) : new Date();
  const dates = formatStartAndEndDates(startDate, endDate);

  const allValues = dates.map((date) => date.toISOString());
  const allOpen = openItems.length === allValues.length;

  const toggleAll = () => {
    setOpenItems(allOpen ? [] : allValues);
  };

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
        <Typography className="pb-2 text-gray-700 dark:text-gray-400">
          {dates.length} day{dates.length > 1 ? "s" : ""}
        </Typography>
      </div>
      <div className="flex flex-row justify-around">
        <div>{itineraryDaysAccordion}</div>
        <div className="flex flex-col space-y-4">
          <Button
            variant="secondary"
            className="mt-4 w-full"
            onClick={toggleAll}
          >
            {allOpen ? "Collapse All" : "Expand All"}
          </Button>
          <Card className="w-[600px]">
            <Accordion
              type="multiple"
              value={openItems}
              onValueChange={setOpenItems}
              className="flex flex-col space-y-4"
            >
              {dates.map((date, i) => (
                <AccordionItem key={i} value={date.toISOString()}>
                  <AccordionTrigger>
                    <span className="text-base">
                      {format(date, "EEE, MMMM d")}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <DailyItineraryCard
                      itineraries={itineraries}
                      date={date}
                      i={i}
                      onRefSet={handleRefSet}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DailyItinerary;
