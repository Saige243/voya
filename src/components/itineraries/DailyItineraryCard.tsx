"use client";

import { format } from "date-fns";
import React, { useState } from "react";
import { Typography } from "../common/Typography";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "next/navigation";
import { type Itinerary } from "@prisma/client";
import CardMenu from "../common/CardMenu";
import { Icon } from "../common/Icon";
import { Input } from "../ui/input";
import { Textarea } from "~/components/ui/textarea";

interface DailyItineraryCardProps {
  date: Date;
  i: number;
  itineraries?: Itinerary[];
  onRefSet: (index: number, ref: HTMLDivElement | null) => void;
}

function DailyItineraryCard({
  date,
  i,
  itineraries,
  onRefSet,
}: DailyItineraryCardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Itinerary>>({});

  const dayItineraries = itineraries?.filter(
    (item) => new Date(item.dateTime).toDateString() === date.toDateString(),
  );

  const handleAddItineraryItem = () => {
    const newPath = `${pathname}/add-itinerary-item`;
    router.push(newPath);
  };

  const handleEditClick = (item: Itinerary) => {
    setEditingId(item.id);
    setEditFormData(item);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting:", editFormData);

    setEditingId(null);
    setEditFormData({});
  };

  const editItineraryItemMenu = (item: Itinerary) => (
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
    <div ref={(el) => onRefSet(i, el)}>
      {dayItineraries && dayItineraries.length > 0 ? (
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
                name="datetime"
                type="datetime-local"
                value={
                  editFormData.date
                    ? new Date(editFormData.datetime).toISOString().slice(0, 16)
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
              className="mb-4 flex flex-row justify-between border-b pb-2"
            >
              <div>
                <Typography className="text-lg font-medium">
                  {item.title}
                </Typography>
                <Typography className="text-sm text-gray-600">
                  {format(new Date(item.datetime), "h:mm a")} — {item.location}
                </Typography>
                {item.notes && (
                  <Typography className="mt-1 text-sm text-muted-foreground">
                    {item.notes}
                  </Typography>
                )}
              </div>
              <CardMenu>{editItineraryItemMenu(item)}</CardMenu>
            </div>
          ),
        )
      ) : (
        <Typography className="text-gray-600 dark:text-gray-400">
          No itinerary items planned for this day.
        </Typography>
      )}
      <Button
        variant="outline"
        onClick={handleAddItineraryItem}
        className="mt-4 w-full"
      >
        <Icon
          name="Plus"
          className="mr-2 text-black dark:text-white"
          size="20"
        />
        Add Itinerary Item
      </Button>
    </div>
  );
}

export default DailyItineraryCard;
