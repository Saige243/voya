"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import {
  Binoculars,
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  Plus,
  Briefcase,
} from "lucide-react";
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
import { Accordion, AccordionContent, AccordionItem } from "./accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import React from "react";
import { useTrip } from "~/app/trips/contexts/TripContext";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
// import formatStartAndEndDates from "~/utils/formatStartandEndDates";

export function AppSidebar() {
  const { trip } = useTrip();
  const tripUrl = `/trips/${trip?.id}/itinerary`;
  const [chevronDown, setChevronDown] = React.useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const items = [
    { title: "Trip Dashboard", url: `/trips/${trip?.id}`, icon: Home },
    {
      title: "Packing List",
      url: `/trips/${trip?.id}/packing-list`,
      icon: Briefcase,
    },
  ];

  const itineraryItems = [
    { title: "Daily Itinerary", url: tripUrl, icon: Binoculars },
    {
      title: "Add Itinerary Item",
      url: `${tripUrl}/add-itinerary-item`,
      icon: Plus,
    },
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
              {trip && (
                <SidebarMenuItem>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                      value="daily-itinerary"
                      className="cursor-pointer border-none"
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

                      <AccordionContent className="flex flex-col gap-2 pl-8">
                        {itineraryItems.map((item) => (
                          <a
                            key={item.title}
                            href={item.url}
                            className="flex items-center gap-1 py-1 text-sm"
                          >
                            <item.icon height={18} className="text-gray-500" />
                            <span>{item.title}</span>
                          </a>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </SidebarMenuItem>
              )}
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
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center gap-2">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    Sign out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
