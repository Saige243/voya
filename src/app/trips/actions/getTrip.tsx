"use server";
import { api } from "~/trpc/server";

async function getTrip(id: string) {
  const tripId = Number(id);
  if (Number.isNaN(tripId) || tripId <= 0) {
    throw new Error(`Invalid trip: ID is${id}`);
  }

  const trip = await api.trip.getById({ id: tripId });
  if (!trip) throw new Error("Trip not found");
  return trip;
}

export default getTrip;
