import React from "react";
import { type Trip } from "@prisma/client";
import { Card } from "~/app/_components/Card";

function TripCard(trip: Trip) {
  return (
    <div className="text-black">
      <a href={`/trips/${trip.id}`}>
        <Card title={trip.title} description={trip.description}>
          <div>
            <h2>{trip.title}</h2>
            <p>{trip.destination}</p>
            <p>{trip.description}</p>
            <p>{trip.startDate.toString()}</p>
            <p>{trip.endDate.toString()}</p>
          </div>
        </Card>
      </a>
    </div>
  );
}

export default TripCard;
