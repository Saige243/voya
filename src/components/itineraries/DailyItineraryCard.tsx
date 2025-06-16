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
import { useTrip } from "~/app/trips/contexts/TripContext";

interface DailyItineraryCardProps {
  date: Date;
  i: number;
  onRefSet: (index: number, ref: HTMLDivElement | null) => void;
}

function DailyItineraryCard({ date, i, onRefSet }: DailyItineraryCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { trip } = useTrip();

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
              <Typography className="text-gray-600 dark:text-gray-400">
                No itinerary items planned for this day.
              </Typography>
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
