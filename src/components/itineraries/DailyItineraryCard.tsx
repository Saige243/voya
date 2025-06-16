import { format } from "date-fns";
import React from "react";
import { Typography } from "../common/Typography";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "next/navigation";
import { type Itinerary } from "@prisma/client";

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

  const dayItineraries = itineraries?.filter(
    (item) => new Date(item.datetime).toDateString() === date.toDateString(),
  );

  const handleAddItineraryItem = () => {
    const newPath = `${pathname}/add-itinerary-item`;
    router.push(newPath);
  };

  return (
    <div ref={(el) => onRefSet(i, el)}>
      {dayItineraries && dayItineraries.length > 0 ? (
        dayItineraries.map((item) => (
          <div key={item.id} className="mb-4 border-b pb-2">
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
        ))
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
        Add Itinerary Item
      </Button>
    </div>
  );
}

export default DailyItineraryCard;
