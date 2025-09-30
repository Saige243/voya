"use client";

import React, { useMemo, useState } from "react";
import { Button } from "~/_components/ui/button";
import { type ItineraryItem, type Trip } from "@prisma/client";
import { api } from "~/trpc/react";
import formatStartAndEndDates from "~/utils/formatStartandEndDates";
import { Accordion } from "~/_components/ui/accordion";
import { Card } from "~/_components/ui/card";
import { set } from "date-fns";
import { useItineraryMutations } from "./hooks/useItineraryMutations";
import { DayItineraryAccordion } from "./DayItineraryAccordion";

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ItineraryItem>>({});
  const [openItems, setOpenItems] = useState<string[]>([]);

  const { data: itineraryItems } = api.itineraryItem.getAll.useQuery(
    { tripId: trip?.id },
    { enabled: !!trip?.id },
  );

  const { createItem, updateItem, deleteItem } = useItineraryMutations(trip.id);

  const dates = useMemo(() => {
    const startDate = trip?.startDate ? new Date(trip.startDate) : new Date();
    const endDate = trip?.endDate ? new Date(trip.endDate) : new Date();
    return formatStartAndEndDates(startDate, endDate);
  }, [trip?.startDate, trip?.endDate]);

  const allValues = dates.map((date) => date.toISOString());
  const allOpen = openItems.length === allValues.length;

  const toggleAll = () => setOpenItems(allOpen ? [] : allValues);

  const handleEditClick = (item: ItineraryItem) => {
    setEditingId(item.id);
    setEditFormData(item);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteItem.mutateAsync({ id });
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleCreateItem = (data: ItineraryFormValues) => {
    const [hours, minutes] = data.time.split(":").map(Number);
    const combined = set(data.date, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    });

    createItem.mutate({
      tripId: trip.id,
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
        await updateItem.mutateAsync({
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

  const handleCancelEdit = () => {
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

          return (
            <DayItineraryAccordion
              key={date.toISOString()}
              date={date}
              items={dayItineraries}
              editingId={editingId}
              editFormData={editFormData}
              onEditClick={handleEditClick}
              onFormDataChange={setEditFormData}
              onSubmitEdit={handleSubmitEditItem}
              onCancelEdit={handleCancelEdit}
              onDeleteItem={handleDeleteItem}
              onCreateItem={handleCreateItem}
            />
          );
        })}
      </Accordion>
    </Card>
  );
}

export default ItineraryAccordion;
