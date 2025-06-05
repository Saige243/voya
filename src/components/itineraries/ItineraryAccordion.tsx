import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { Link, Calendar, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "path";
import React from "react";
import { SidebarMenuButton } from "../ui/sidebar";

function ItineraryAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="daily-itinerary"
        className="cursor-pointer border-none"
      >
        <Link
          href={{
            pathname: `/trips/${tripId}/itinerary`,
          }}
          className="flex items-center gap-2"
        >
          <AccordionTrigger asChild>
            <SidebarMenuButton
              asChild
              onClick={() => setChevronDown(!chevronDown)}
            >
              <div className="flex w-full items-center gap-2">
                <Calendar />
                <span>Daily Itinerary</span>
                {chevronDown ? (
                  <ChevronUp className="ml-auto" />
                ) : (
                  <ChevronDown className="ml-auto" />
                )}
              </div>
            </SidebarMenuButton>
          </AccordionTrigger>
        </Link>

        <AccordionContent className="flex flex-col gap-2 pl-8">
          {dates.map((date, index) => {
            const formattedDate = format(date, "EEE, MMMM d");
            return (
              <Link
                key={index}
                href={`${tripUrl}/${index + 1}`}
                className="text-sm hover:underline"
              >
                <span className="pr-1 text-gray-400">Day {index + 1}:</span>
                {formattedDate}
              </Link>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ItineraryAccordion;
