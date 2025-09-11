"use client";

import { format } from "date-fns";
import React, { useMemo, useState } from "react";
import { Typography } from "~/_components/common/Typography";
import { Button } from "~/_components/ui/button";
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
  link: string;
};

function ItineraryAccordion({ trip }: DailyItineraryAccordionProps) {
  const utils = api.useUtils();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ItineraryItem>>({});
  const [selectedItineraryItem, setSelectedItineraryItem] =
    useState<ItineraryItem | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const { data: itineraryItems } = api.itineraryItem.getAll.useQuery(
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

  const isGoogleMapsLink = (link: string) => link?.includes("google.com/maps");

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
      await utils.itineraryItem.getAll.invalidate({ tripId: trip.id });
    },
    onError: (err) => {
      console.error("Error creating itinerary item:", err);
    },
  });

  const updateItineraryItem = api.itineraryItem.update.useMutation({
    onSuccess: async () => {
      await utils.itineraryItem.getAll.invalidate({ tripId: trip.id });
    },
    onError: (err) => {
      console.error("Error updating itinerary item:", err);
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
      link: data.link,
    });
  };

  const handleSubmitEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId && editFormData) {
        await updateItineraryItem.mutateAsync({
          id: editingId,
          title: editFormData.title ?? "",
          location: editFormData.location ?? "",
          description: editFormData.description ?? null,
          isMeal: editFormData.isMeal ?? false,
          mealType: editFormData.isMeal ? (editFormData.mealType ?? "") : null,
          notes: editFormData.notes ?? "",
          time: editFormData.time ?? new Date(),
          link: editFormData.link ?? null,
        });
      }
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
                                <SelectItem value="coffee">Coffee</SelectItem>
                                <SelectItem value="brunch">Brunch</SelectItem>
                                <SelectItem value="lunch">Lunch</SelectItem>
                                <SelectItem value="snack">Snack</SelectItem>
                                <SelectItem value="dinner">Dinner</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <Label htmlFor="link">Link</Label>
                        <Input
                          name="link"
                          value={editFormData.link ?? ""}
                          onChange={handleChange}
                          placeholder="Link"
                          className="mb-2"
                        />
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
                        className="mb-4 ml-8 flex flex-row border-b pb-2"
                      >
                        <div
                          className={`mr-2 flex h-fit flex-row rounded-full py-1 pr-2 ${
                            item.isMeal
                              ? "bg-green-500"
                              : "bg-gray-400 dark:bg-gray-700"
                          }`}
                        >
                          {item.isMeal && item.mealType === "coffee" ? (
                            <Icon
                              name="Coffee"
                              className="pl-2 text-white"
                              size="24"
                            />
                          ) : item.isMeal ? (
                            <Icon
                              name="Utensils"
                              className="pl-2 text-white"
                              size="24"
                            />
                          ) : (
                            <Icon
                              name="Text"
                              className="pl-2 text-white"
                              size="24"
                            />
                          )}
                        </div>
                        <div className="w-full pr-2">
                          <Typography className="flex flex-row items-center gap-1 text-base font-medium">
                            {item.title}
                            {item.isMeal && (
                              <Typography className="rounded-full border border-green-500 px-2 text-sm font-bold text-green-500 decoration-2">
                                {item.mealType?.toUpperCase()}
                              </Typography>
                            )}
                          </Typography>
                          <div className="flex  flex-row justify-between">
                            <div>
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
                                {/* TODO: make google maps dropdown location finder */}
                                <Icon
                                  name="Map"
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
                                    className="shrink-0 pr-2 text-black dark:text-white"
                                    size="24"
                                  />
                                  <Typography className="text-sm text-gray-600">
                                    {item.notes}
                                  </Typography>
                                </div>
                              )}
                              {item.link && (
                                <div className="mb-3 flex flex-row items-center">
                                  <Icon
                                    name={
                                      isGoogleMapsLink(item.link)
                                        ? "MapPin"
                                        : "Link"
                                    }
                                    className="pr-2 text-black dark:text-white"
                                    size="24"
                                  />
                                  <Typography className="text-sm text-gray-600">
                                    <a
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline-offset-5 underline hover:text-blue-600"
                                    >
                                      {isGoogleMapsLink(item.link)
                                        ? "Google Maps Link"
                                        : item.title}
                                    </a>
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
                                    Edit Item
                                  </Button>
                                  <ConfirmationModal
                                    buttonText="Delete"
                                    icon="Trash"
                                    iconColor="red-500"
                                    text="Are you sure you want to delete this item?"
                                    confirmation="Delete Item"
                                    showInput={false}
                                    onConfirm={() => handleDeleteItem(item.id)}
                                  />
                                </>
                              </CardMenu>
                            </div>
                          </div>
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

export default ItineraryAccordion;
