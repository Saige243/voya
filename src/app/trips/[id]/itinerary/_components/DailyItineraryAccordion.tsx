"use client";

import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { Typography } from "~/_components/common/Typography";
import { Button } from "~/_components/ui/button";
import { useRouter } from "next/navigation";
import { type ItineraryItem, type Itinerary, type Trip } from "@prisma/client";
import CardMenu from "~/_components/common/CardMenu";
import { Icon } from "~/_components/common/Icon";
import { Input } from "~/_components/ui/input";
import { Textarea } from "~/_components/ui/textarea";
import { updateItineraryItem } from "~/app/trips/actions/updateItineraryItem";
import { api } from "~/trpc/react";
import formatStartAndEndDates from "~/utils/formatStartandEndDates";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/_components/ui/accordion";
import { Card } from "~/_components/ui/card";
import NewItineraryModal from "./NewItineraryModal";

interface DailyItineraryAccordionProps {
  trip: Trip;
}

function DailyItineraryAccordion({ trip }: DailyItineraryAccordionProps) {
  const router = useRouter();

  const [itineraryItems, setItineraryItems] = useState<
    (Itinerary & { itineraryItems: ItineraryItem[] })[]
  >([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ItineraryItem>>({});
  const [selectedItineraryItem, setSelectedItineraryItem] =
    useState<ItineraryItem | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const { data } = api.itinerary.getAll.useQuery(
    { tripId: trip?.id },
    { enabled: !!trip?.id },
  );

  const tripId = trip?.id;

  useEffect(() => {
    if (data) setItineraryItems(data);
  }, [data]);

  const dates = useMemo(() => {
    const startDate = trip?.startDate ? new Date(trip.startDate) : new Date();
    const endDate = trip?.endDate ? new Date(trip.endDate) : new Date();
    return formatStartAndEndDates(startDate, endDate);
  }, [trip?.startDate, trip?.endDate]);

  const allValues = dates.map((date) => date.toISOString());
  const allOpen = openItems.length === allValues.length;

  const toggleAll = () => setOpenItems(allOpen ? [] : allValues);

  const formatTime = (timeDate: Date | null) =>
    !timeDate ? "All day" : format(timeDate, "h:mm a");

  const handleEditClick = (item: ItineraryItem) => {
    setSelectedItineraryItem(item);
    setEditingId(item.id);
    setEditFormData(item);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateItineraryItem({
        formData: {
          id: editFormData.id!,
          title: editFormData.title ?? selectedItineraryItem?.title ?? "",
          location:
            editFormData.location ?? selectedItineraryItem?.location ?? "",
          time: editFormData.time
            ? new Date(editFormData.time)
            : (selectedItineraryItem?.time ?? null),
          notes: editFormData.notes ?? selectedItineraryItem?.notes ?? "",
          description: selectedItineraryItem?.description ?? null,
          itineraryId: selectedItineraryItem?.itineraryId ?? 0,
        },
      });
      router.refresh();
    } catch (err) {
      console.error("Failed to update:", err);
    }
    setEditingId(null);
    setEditFormData({});
  };

  const editItineraryItemMenu = (item: ItineraryItem) => (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => handleEditClick(item)}
    >
      <Icon name="Pencil" className="text-black dark:text-white" size="20" />
      Edit Itinerary Item
    </Button>
  );

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
          const dayItinerary = itineraryItems.find(
            (it) => new Date(it.date).toDateString() === date.toDateString(),
          );
          const dayItineraries = dayItinerary?.itineraryItems ?? [];

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
                  dayItineraries.map((item) =>
                    editingId === item.id ? (
                      <form
                        key={item.id}
                        onSubmit={handleSubmit}
                        className="mb-4 border-b pb-4"
                      >
                        <Input
                          name="title"
                          value={editFormData.title ?? ""}
                          onChange={handleChange}
                          placeholder="Title"
                          className="mb-2"
                        />
                        <Input
                          name="time"
                          type="datetime-local"
                          value={
                            editFormData.time
                              ? new Date(editFormData.time)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={handleChange}
                          className="mb-2"
                        />
                        <Input
                          name="location"
                          value={editFormData.location ?? ""}
                          onChange={handleChange}
                          placeholder="Location"
                          className="mb-2"
                        />
                        <Textarea
                          name="notes"
                          value={editFormData.notes ?? ""}
                          onChange={handleChange}
                          placeholder="Notes"
                          className="mb-2"
                        />
                        <div className="flex justify-center gap-2">
                          <Button type="submit">Save</Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div
                        key={item.id}
                        className="mb-4 ml-8 flex flex-row items-center border-b pb-2"
                      >
                        <div className="pr-2">
                          <Icon
                            name="Clock"
                            className="text-black dark:text-white"
                            size="15"
                          />
                        </div>
                        <div className="flex w-full justify-between">
                          <div>
                            <Typography className="text-base font-medium">
                              {item.title}
                            </Typography>
                            <Typography className="text-sm text-gray-600">
                              {formatTime(item.time)} — {item.location}
                            </Typography>
                            {item.notes && (
                              <Typography className="mt-1 text-sm text-muted-foreground">
                                {item.notes}
                              </Typography>
                            )}
                          </div>
                          <div>
                            <CardMenu>{editItineraryItemMenu(item)}</CardMenu>
                          </div>
                        </div>
                      </div>
                    ),
                  )
                )}
                <div className="flex w-full justify-center">
                  <NewItineraryModal tripId={tripId} date={date} />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Card>
  );
}

export default DailyItineraryAccordion;
