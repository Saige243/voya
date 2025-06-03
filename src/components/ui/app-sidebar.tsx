"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
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
import { useParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem } from "./accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import React from "react";

export function AppSidebar() {
  const params = useParams();
  const tripId = params.id as string;
  const tripUrl = `/trips/${tripId}/itinerary`;
  const [chevronDown, setChevronDown] = React.useState(false);

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
                    <AccordionTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        onClick={() => setChevronDown(!chevronDown)}
                      >
                        <div className="flex w-full items-center gap-2">
                          <Calendar />
                          <span>Daily Itinerary</span>
                          {chevronDown ? (
                            <ChevronDown className="ml-auto h-4 w-4" />
                          ) : (
                            <ChevronUp className="ml-auto h-4 w-4" />
                          )}
                        </div>
                      </SidebarMenuButton>
                    </AccordionTrigger>

                    <AccordionContent className="flex flex-col gap-2 pl-8">
                      <a
                        href={`${tripUrl}/day-1`}
                        className="text-sm hover:underline"
                      >
                        Day 1: Arrival
                      </a>
                      <a
                        href={`${tripUrl}/day-2`}
                        className="text-sm hover:underline"
                      >
                        Day 2: City Tour
                      </a>
                      <a
                        href={`${tripUrl}/day-3`}
                        className="text-sm hover:underline"
                      >
                        Day 3: Beach
                      </a>
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
