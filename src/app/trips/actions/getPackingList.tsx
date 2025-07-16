"use server";
import { api } from "~/trpc/server";

async function getPackingList(id: string) {
  const tripId = parseInt(id);

  const packingList = await api.packingList.getAll({ tripId: tripId });
  if (!packingList) throw new Error(`No packing list for ${tripId} found`);
  return packingList;

  // const packingListCategories = await api.packinglist
}

export default getPackingList;
