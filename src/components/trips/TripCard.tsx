import React from "react";
import { type Trip } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

function TripCard(trip: Trip) {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: "link" }),
        "no-underline hover:no-underline",
      )}
      href={`/trips/${trip.id}`}
    >
      <Card>
        <CardContent>
          <CardHeader className="text-base md:text-lg">
            <CardTitle className="text-base md:text-lg">{trip.title}</CardTitle>
            <CardDescription>{trip.destination}</CardDescription>
          </CardHeader>
          <CardFooter>
            <div className="flex w-full text-base">
              <p>{format(new Date(trip.startDate), "MMMM d, yyyy")}</p>
              <span className="px-2">{" - "}</span>
              <p>{format(new Date(trip.endDate), "MMMM d, yyyy")}</p>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </Link>
  );
}

export default TripCard;
