import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { format } from "date-fns";
import React from "react";
import { Typography } from "../common/Typography";
import { Card, CardContent } from "../ui/card";

interface DailyItineraryCardProps {
  date: Date;
  i: number;
  onRefSet: (index: number, ref: HTMLDivElement | null) => void;
}

function DailyItineraryCard({ date, i, onRefSet }: DailyItineraryCardProps) {
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
            <AccordionTrigger>{format(date, "EEE, MMMM d")}</AccordionTrigger>
            <AccordionContent>
              <Typography className="text-gray-600 dark:text-gray-400">
                No events planned for this day.
              </Typography>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default DailyItineraryCard;
