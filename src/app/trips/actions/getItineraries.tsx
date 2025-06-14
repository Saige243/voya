"use server";
import { api } from "~/trpc/server";

async function getItineraries(id: string) {
  const tripId = parseInt(id);
  const itineraries = await api.trip.getById({ id: tripId });

  if (!itineraries) throw new Error(`No itineraries for ${tripId} found`);
  return itineraries;
}

export default getItineraries;
