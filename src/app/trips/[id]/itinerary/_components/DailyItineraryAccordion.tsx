"use client";

import { format } from "date-fns";
import React, { useMemo, useState } from "react";
import { Typography } from "~/_components/common/Typography";
import { Button } from "~/_components/ui/button";
import { useRouter } from "next/navigation";
import { type ItineraryItem, type Trip } from "@prisma/client";
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
import ConfirmationModal from "../../../_components/ConfirmationModal";
import { set } from "date-fns";
import { Label } from "~/_components/ui/label";
import { Checkbox } from "~/_components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";

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
};

function DailyItineraryAccordion({ trip }: DailyItineraryAccordionProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ItineraryItem>>({});
  const [selectedItineraryItem, setSelectedItineraryItem] =
    useState<ItineraryItem | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const { data: itineraryItems } = api.itinerary.getAll.useQuery(
    { tripId: trip?.id },
    { enabled: !!trip?.id },
  );

  const tripId = trip?.id;

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

  const createItineraryItem = api.itineraryItem.create.useMutation({
    onSuccess: async () => {
      await utils.itinerary.getAll.invalidate({ tripId: trip.id });
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
      await utils.itinerary.getAll.invalidate({ tripId: trip.id });
    },
  });

  const handleCreateItem = (data: ItineraryFormValues) => {
    const [hours, minutes] = data.time.split(":").map(Number);

    const combined = set(data.date, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    });

    createItineraryItem.mutate({
      tripId,
      title: data.title,
      date: data.date,
      time: combined,
      location: data.location,
      notes: data.notes,
      isMeal: data.isMeal,
      mealType: data.mealType,
    });
  };

  const handleSubmitEditItem = async (e: React.FormEvent) => {
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
          isMeal: editFormData.isMeal ?? selectedItineraryItem?.isMeal ?? false,
          mealType:
            editFormData.mealType ?? selectedItineraryItem?.mealType ?? null,
          description: selectedItineraryItem?.description ?? null,
          itineraryId: selectedItineraryItem?.itineraryId ?? 0,
        },
      });
      await utils.itinerary.getAll.invalidate({ tripId: trip.id });
    } catch (err) {
      console.error("Failed to update:", err);
    }
    setEditingId(null);
    setEditFormData({});
  };

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
          const dayItinerary = itineraryItems?.find(
            (it) => new Date(it.date).toDateString() === date.toDateString(),
          );
          const dayItineraries = dayItinerary?.itineraryItems ?? [];
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
                      <form
                        key={item.id}
                        onSubmit={handleSubmitEditItem}
                        className="mb-4 border-b pb-4"
                      >
                        <Label htmlFor="title">Title</Label>
                        <Input
                          name="title"
                          value={editFormData.title ?? ""}
                          onChange={handleChange}
                          placeholder="Title"
                          className="mb-2"
                        />
                        <Label htmlFor="time">Time</Label>
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
                        <Label htmlFor="location">Location</Label>
                        <Input
                          name="location"
                          value={editFormData.location ?? ""}
                          onChange={handleChange}
                          placeholder="Location"
                          className="mb-2"
                        />
                        <div className="mb-2 flex items-center gap-2">
                          <Checkbox
                            id="isMeal"
                            checked={editFormData.isMeal ?? false}
                            onCheckedChange={(checked) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                isMeal: checked === true,
                                mealType: checked
                                  ? (prev.mealType ?? "")
                                  : null,
                              }))
                            }
                          />
                          <Label htmlFor="isMeal">Meal?</Label>
                        </div>

                        {editFormData.isMeal && (
                          <div className="mb-2">
                            <Label htmlFor="mealType">Meal Type</Label>
                            <Select
                              onValueChange={(value) =>
                                setEditFormData((prev) => ({
                                  ...prev,
                                  mealType: value,
                                }))
                              }
                              value={editFormData.mealType ?? ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a meal" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="breakfast">
                                  Breakfast
                                </SelectItem>
                                <SelectItem value="brunch">Brunch</SelectItem>
                                <SelectItem value="lunch">Lunch</SelectItem>
                                <SelectItem value="snack">Snack</SelectItem>
                                <SelectItem value="dinner">Dinner</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <Label htmlFor="notes">Notes</Label>
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
                        className="mb-4 ml-8 flex items-center justify-between border-b pb-2"
                      >
                        <div className="pr-2">
                          <Typography className="text-base font-medium underline">
                            {item.title}
                          </Typography>
                          <div className="flex flex-row items-center">
                            <Icon
                              name="Clock"
                              className="pr-2 text-black dark:text-white"
                              size="24"
                            />
                            <Typography className="text-sm text-gray-600">
                              {formatTime(item.time)}
                            </Typography>
                          </div>
                          <div className="flex flex-row items-center">
                            <Icon
                              name="MapPin"
                              className="pr-2 text-black dark:text-white"
                              size="24"
                            />
                            <Typography className="text-sm text-gray-600">
                              {item.location}
                            </Typography>
                          </div>
                          {item.notes && (
                            <div className="flex flex-row items-center">
                              <Icon
                                name="MessageCircleMore"
                                className="pr-2 text-black dark:text-white"
                                size="24"
                              />
                              <Typography className="text-sm text-gray-600">
                                {item.notes}
                              </Typography>
                            </div>
                          )}
                          {item.isMeal && (
                            <div className="flex w-fit flex-row items-center rounded-lg bg-green-400 pr-2">
                              <Icon
                                name="Utensils"
                                className="pl-2 text-white dark:text-white"
                                size="24"
                              />
                              <Typography className="pl-2 text-sm font-bold text-white">
                                {item.mealType?.toUpperCase()}
                              </Typography>
                            </div>
                          )}
                        </div>
                        <div>
                          <CardMenu>
                            <>
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => handleEditClick(item)}
                              >
                                <Icon
                                  name="Pencil"
                                  className="text-black dark:text-white"
                                  size="20"
                                />
                                Edit
                              </Button>
                              <ConfirmationModal
                                buttonText="Delete"
                                icon="Trash"
                                iconColor="red-500"
                                text="Are you sure you want to delete this itinerary item?"
                                confirmation="Delete"
                                onConfirm={() => handleDeleteItem(item.id)}
                              />
                            </>
                          </CardMenu>
                        </div>
                      </div>
                    ),
                  )
                )}
                <div className="flex w-full justify-center">
                  <NewItineraryModal date={date} onConfirm={handleCreateItem} />
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
