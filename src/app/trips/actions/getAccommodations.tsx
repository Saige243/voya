"use server";
import { api } from "~/trpc/server";

async function getAccommodations(id: string) {
  const tripId = parseInt(id);
  try {
    return await api.accommodation.getAll({ tripId });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    throw new Error("No accommodations found");
  }
}

export default getAccommodations;
