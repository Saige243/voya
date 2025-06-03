"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Calendar, ChevronDown, ChevronUp, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import NavAvatarMenu from "../common/NavAvatarMenu";
import { Separator } from "./separator";
import { useParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem } from "./accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import React, { useEffect } from "react";
import getTrip from "~/app/trips/actions/getTrip";
import { format } from "date-fns";
import Link from "next/link";

export function AppSidebar() {
  const params = useParams();
  const tripId = params.id as string;
  const tripUrl = `/trips/${tripId}/itinerary`;
  const [chevronDown, setChevronDown] = React.useState(false);
  type Trip = Awaited<ReturnType<typeof getTrip>>;
  const [trip, setTrip] = React.useState<Trip | null>(null);

  useEffect(() => {
    async function fetchTrip() {
      const data = await getTrip(tripId);
      setTrip(data);
    }

    if (tripId) {
      fetchTrip().catch(console.error);
    }
  }, [tripId]);

  function formatTripDates(startDate: Date, endDate: Date) {
    const date = new Date(startDate);
    const dates: Date[] = [];

    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  const startDate = trip?.startDate;
  const endDate = trip?.endDate ?? new Date();
  const dates =
    startDate && endDate
      ? formatTripDates(new Date(startDate), new Date(endDate))
      : [];

  console.log("Trip Dates:", dates);

  const items = [
    { title: "Trip Dashboard", url: `/trips/${tripId}`, icon: Home },
    // { title: "Itinerary", url: tripUrl, icon: Calendar },
  ];

  return (
    <Sidebar>
      <SidebarContent className="bg-white p-2">
        <SidebarGroup>
          <SidebarGroupLabel>Voya</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href={`/`} className="flex items-center gap-2">
                    <Home />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Separator className="my-2" />
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
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
                      {" "}
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
                      {dates.map((date, index) => (
                        <a
                          key={index}
                          href={`${tripUrl}/day-${index + 1}`}
                          className="text-sm hover:underline"
                        >
                          <span className="pr-1 text-gray-400">
                            Day {index + 1}:
                          </span>
                          {format(date, "EEE, MMMM d")}
                        </a>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white pb-6">
        <Separator className="mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-full focus:outline-none focus:ring-0"
                asChild
              >
                <SidebarMenuButton className="flex items-center gap-2">
                  <NavAvatarMenu />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="mb-4 w-[--radix-popper-anchor-width] p-4"
              >
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
