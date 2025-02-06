import React from "react";
import { type Trip } from "@prisma/client";
import { Card } from "~/app/_components/common/Card";
import { format } from "date-fns";
import { Label } from "~/app/_components/common/Label";

function TripCard(trip: Trip) {
  return (
    <div className="text-black">
      <a href={`/trips/${trip.id}`}>
        <Card className="w-[500px]">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="destination">Destination:</Label>
              <h2 className="mb-2 text-xl font-semibold">{trip.destination}</h2>
              <Label htmlFor="title">Title:</Label>
              <h2 className="mb-2 font-bold">{trip.title}</h2>

              <Label htmlFor="description">Description:</Label>
              <h2 className="mb-2 font-semibold">{trip.description}</h2>
            </div>

            <div>
              <Label htmlFor="start-date">Start Date:</Label>
              <p className="mb-2">
                {format(new Date(trip.startDate), "MMMM d, yyyy")}
              </p>

              <Label htmlFor="end-date">End Date:</Label>
              <p>{format(new Date(trip.endDate), "MMMM d, yyyy")}</p>
            </div>
          </div>
        </Card>
      </a>
    </div>
  );
}

export default TripCard;
