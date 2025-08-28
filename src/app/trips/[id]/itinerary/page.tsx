"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/_components/ui/accordion";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import React, { useEffect, useRef } from "react";
import { Typography } from "~/_components/common/Typography";
import formatStartAndEndDates from "~/utils/formatStartandEndDates";
import { Button } from "~/_components/ui/button";
import { useTrip } from "~/app/trips/contexts/TripContext";
import { Card } from "~/_components/ui/card";
import { redirect } from "next/navigation";
import DailyItineraryCard from "~/app/trips/[id]/itinerary/_components/DailyItineraryCard";

export default function ItineraryPage() {
  const params = useParams();
  const { trip } = useTrip();
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const dayIndex = parseInt(params.index as string) - 1;

  const dateRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (!trip) {
    redirect("/");
  }

  useEffect(() => {
    if (dayIndex >= 0 && dateRefs.current[dayIndex]) {
      dateRefs.current[dayIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [dayIndex, trip]);

  const startDate = trip?.startDate ? new Date(trip.startDate) : new Date();
  const endDate = trip?.endDate ? new Date(trip.endDate) : new Date();
  const dates = formatStartAndEndDates(startDate, endDate);

  const allValues = dates.map((date) => date.toISOString());
  const allOpen = openItems.length === allValues.length;

  const toggleAll = () => {
    setOpenItems(allOpen ? [] : allValues);
  };

  const dailyItinerary = (
    <div className="flex flex-col space-y-4">
      <Button variant="secondary" className="mt-4 w-full" onClick={toggleAll}>
        {allOpen ? "Collapse All" : "Expand All"}
      </Button>
      <Card className="w-[600px]">
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="flex flex-col space-y-4"
        >
          <DailyItineraryCard trip={trip} />
        </Accordion>
      </Card>
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
        <div>{dailyItinerary}</div>
      </div>
    </div>
  );
}
