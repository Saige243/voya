import React from "react";
import { type Itinerary, type Trip } from "@prisma/client";

function ItineraryBlock({
  trip,
  itineraries,
}: {
  trip: Trip | null;
  itineraries: Itinerary[];
}) {
  return (
    <div className="py-4">
      {itineraries && itineraries.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold">Itineraries</h2>
          <ul className="mt-2 space-y-2">
            {itineraries.map((itinerary) => (
              <li key={itinerary.id} className="rounded-lg border p-4 shadow">
                <p>
                  <span className="font-bold">Date:</span>{" "}
                  {new Date(itinerary.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-bold">Time:</span>{" "}
                  {new Date(itinerary.time).toLocaleTimeString()}
                </p>
                <p>
                  <span className="font-bold">Location:</span>{" "}
                  {itinerary.location}
                </p>
                <p>
                  <span className="font-bold">Notes:</span> {itinerary.notes}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">No itineraries!</p>
          <a
            href={`/trips/${trip?.id}/edit`}
            className="mt-2 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add Itinerary
          </a>
        </div>
      )}
    </div>
  );
}

export default ItineraryBlock;
