import { api } from "~/trpc/react";

export function useItineraryMutations(tripId: number) {
  const utils = api.useUtils();

  const createItem = api.itineraryItem.create.useMutation({
    onSuccess: async () => {
      await utils.itineraryItem.getAll.invalidate({ tripId });
    },
    onError: (err) => {
      console.error("Error creating itinerary item:", err);
    },
  });

  const updateItem = api.itineraryItem.update.useMutation({
    onSuccess: async () => {
      await utils.itineraryItem.getAll.invalidate({ tripId });
    },
    onError: (err) => {
      console.error("Error updating itinerary item:", err);
    },
  });

  const deleteItem = api.itineraryItem.delete.useMutation({
    onSuccess: async () => {
      await utils.itineraryItem.getAll.invalidate({ tripId });
    },
  });

  return { createItem, updateItem, deleteItem };
}
