"use client";

import { format, set } from "date-fns";
import React, { useMemo, useState } from "react";
import { Typography } from "~/_components/common/Typography";
import { Button } from "~/_components/ui/button";
import { type Trip } from "@prisma/client";
import { Icon } from "~/_components/common/Icon";
import { api } from "~/trpc/react";
import formatStartAndEndDates from "~/utils/formatStartandEndDates";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/_components/ui/accordion";
import { Card } from "~/_components/ui/card";
import ItineraryForm from "./ItineraryForm";
import ItineraryView from "./ItineraryView";
interface DailyItineraryAccordionProps {
  trip: Trip;
}

type ItineraryFormValues = {
  title: string;
  date: Date;
  time: string;
  location: string;
  notes: string;
  isMeal: boolean;
  mealType?: string;
  link: string;
};

function ItineraryAccordion({ trip }: DailyItineraryAccordionProps) {
  const utils = api.useUtils();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const { data: itineraryItems } = api.itineraryItem.getAll.useQuery(
    { tripId: trip?.id },
    { enabled: !!trip?.id },
  );

  const dates = useMemo(() => {
    const startDate = trip?.startDate ? new Date(trip.startDate) : new Date();
    const endDate = trip?.endDate ? new Date(trip.endDate) : new Date();
    return formatStartAndEndDates(startDate, endDate);
  }, [trip?.startDate, trip?.endDate]);

  const allValues = dates.map((date) => date.toISOString());
  const allOpen = openItems.length === allValues.length;

  const toggleAll = () => setOpenItems(allOpen ? [] : allValues);

  const createItineraryItem = api.itineraryItem.create.useMutation({
    onSuccess: async (data) => {
      console.log("Itinerary item created", data);
      await utils.itineraryItem.getAll.invalidate({ tripId: trip.id });
    },
    onError: (err) => {
      console.error("Error creating itinerary item:", err);
    },
  });

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteItineraryItem.mutateAsync({ id });
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const deleteItineraryItem = api.itineraryItem.delete.useMutation({
    onSuccess: async () => {
      await utils.itineraryItem.getAll.invalidate({ tripId: trip.id });
    },
  });

  return (
    <Card className="w-full">
      <Button variant="secondary" className="mb-4 w-full" onClick={toggleAll}>
        {allOpen ? "Collapse All" : "Expand All"}
      </Button>

      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="flex flex-col space-y-4"
      >
        {dates.map((date) => {
          const dayItineraries = (itineraryItems ?? []).filter(
            (it) =>
              it.time &&
              new Date(it.time).toDateString() === date.toDateString(),
          );

          const orderedItineraries = dayItineraries.sort((a, b) => {
            if (a.time && b.time) {
              return new Date(a.time).getTime() - new Date(b.time).getTime();
            }
            return 0;
          });

          return (
            <AccordionItem key={date.toISOString()} value={date.toISOString()}>
              <AccordionTrigger>
                <div className="flex w-full items-center justify-between">
                  <Typography className="flex items-center text-lg font-semibold">
                    <Icon
                      name="Calendar"
                      className="mr-4 text-black dark:text-white"
                      size="20"
                    />

                    {format(date, "EEEE, MMM d")}
                  </Typography>
                  <Typography>{dayItineraries.length} Items</Typography>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {dayItineraries.length === 0 ? (
                  <Typography className="mb-2 text-gray-600 dark:text-gray-400">
                    No itinerary items planned for this day.
                  </Typography>
                ) : (
                  orderedItineraries.map((item) =>
                    editingId === item.id ? (
                      <ItineraryForm
                        key={item.id}
                        tripId={trip.id}
                        item={item}
                        date={new Date(item.itinerary.date)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <ItineraryView
                        key={item.id}
                        item={item}
                        tripId={trip.id}
                        onEditClick={() => setEditingId(item.id)}
                        onDeleteClick={handleDeleteItem}
                      />
                    ),
                  )
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Card>
  );
}

export default ItineraryAccordion;
