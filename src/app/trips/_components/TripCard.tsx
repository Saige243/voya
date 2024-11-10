import React from "react";
import { type Trip } from "@prisma/client";
import { Card } from "~/app/_components/ui/Card";

function TripCard(trip: Trip) {
  return (
    <div className="text-black">
      <a href={`/trips/${trip.id}`}>
        <Card
          title={trip.title}
          description={trip.description}
          className="w-[500px]"
        >
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-500" htmlFor="title">
                Title:
              </label>
              <h1 className="mb-2 text-xl font-bold">{trip.title}</h1>

              <label
                className="block text-sm text-gray-500"
                htmlFor="destination"
              >
                Destination:
              </label>
              <h2 className="mb-2 font-semibold">{trip.destination}</h2>

              <label
                className="block text-sm text-gray-500"
                htmlFor="description"
              >
                Description:
              </label>
              <p className="text-gray-700">{trip.description}</p>
            </div>

            <div>
              <label
                className="block text-sm text-gray-500"
                htmlFor="start-date"
              >
                Start Date:
              </label>
              <p className="mb-2">{trip.startDate.toDateString()}</p>

              <label className="block text-sm text-gray-500" htmlFor="end-date">
                End Date:
              </label>
              <p>{trip.endDate.toDateString()}</p>
            </div>
          </div>
        </Card>
      </a>
    </div>
  );
}

export default TripCard;
