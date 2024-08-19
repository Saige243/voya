import React from "react";
import { type Itinerary } from "@prisma/client";

function ItineraryBlock(itineraries: Itinerary[]) {
  return itineraries.length > 0 ? (
    <div className="py-4">Itinerary</div>
  ) : (
    <div className="py-4">No Iteneraries</div>
  );
}

export default ItineraryBlock;
