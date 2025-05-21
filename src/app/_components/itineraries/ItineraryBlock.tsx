import React from "react";
import { type Itinerary, type Trip } from "@prisma/client";
import { Label } from "~/app/_components/common/Label";
import { Typography } from "~/app/_components/common/Typography";
import { IconButton } from "~/app/_components/common/OldButton";
import { Icon } from "~/app/_components/common/Icon";
import { format } from "date-fns";
import { DeleteItineraryButton } from "./DeleteItineraryButton";

type ItineraryBlockProps = {
  trip: Trip | null;
  itineraries: Itinerary[] | null;
};

export default function ItineraryBlock({
  trip,
  itineraries,
}: ItineraryBlockProps) {
  return (
    <div className="w-full">
      {itineraries && itineraries.length > 0 ? (
        <div className="space-y-4">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className="max-w-[500px] rounded-lg border bg-white p-6 text-black shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <div className="flex items-center justify-between">
                <Typography variant="heading1">{itinerary.title}</Typography>
              </div>
              <div className="mb-4 mt-4 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`datetime-${itinerary.id}`}>Date:</Label>
                  <Typography>
                    {format(
                      new Date(itinerary.datetime as string | number | Date),
                      "MMM dd, yyyy",
                    )}
                  </Typography>
                </div>
                <div>
                  <Label htmlFor={`datetime-${itinerary.id}`}>Time:</Label>
                  <Typography>
                    {format(
                      new Date(itinerary.datetime as string | number | Date),
                      "hh:mm a",
                    )}
                  </Typography>
                </div>
              </div>
              {itinerary.location && (
                <div className="mb-4">
                  <Label htmlFor={`location-${itinerary.id}`}>Location:</Label>
                  <Typography>{itinerary.location}</Typography>
                </div>
              )}
              {itinerary.notes && (
                <div className="mb-4">
                  <Label htmlFor={`notes-${itinerary.id}`}>Notes:</Label>
                  <Typography>{itinerary.notes}</Typography>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <a href={`/trips/${trip?.id}/edit`}>
                  <IconButton className="border-none bg-transparent">
                    <Icon
                      name="Pencil"
                      className="text-black dark:text-white"
                      size="20"
                    />
                  </IconButton>
                </a>
                <DeleteItineraryButton id={itinerary.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">No itineraries!</p>
          <a
            href={`/trips/${trip?.id}/edit`}
            className="mt-2 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add Itinerary
          </a>
        </div>
      )}
    </div>
  );
}
