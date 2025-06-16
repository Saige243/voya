import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { format } from "date-fns";
import React from "react";
import { Typography } from "../common/Typography";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { type Itinerary } from "@prisma/client";

interface DailyItineraryCardProps {
  date: Date;
  i: number;
  itineraries?: Itinerary[]; // Adjust type as needed
  onRefSet: (index: number, ref: HTMLDivElement | null) => void;
}

function DailyItineraryCard({
  date,
  i,
  onRefSet,
  itineraries,
}: DailyItineraryCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  console.log("ITINERARIES:", itineraries);

  const dayItineraries = itineraries?.filter(
    (item) => new Date(item.datetime).toDateString() === date.toDateString(),
  );

  const handleAddItineraryItem = () => {
    const newPath = `${pathname}/add-itinerary-item`;
    router.push(newPath);
  };

  return (
    <Card className="w-[600px]" ref={(el) => onRefSet(i, el)}>
      <CardContent>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value={date.toISOString()}>
            <CardHeader>
              <AccordionTrigger>{format(date, "EEE, MMMM d")}</AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              {dayItineraries && dayItineraries.length > 0 ? (
                dayItineraries.map((item) => (
                  <div key={item.id} className="mb-4 border-b pb-2">
                    <Typography className="text-lg font-medium">
                      {item.title}
                    </Typography>
                    <Typography className="text-sm text-gray-600">
                      {format(new Date(item.datetime), "h:mm a")} —{" "}
                      {item.location}
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default DailyItineraryCard;
