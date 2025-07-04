"use server";

import { api } from "~/trpc/server";
import * as yup from "yup";
import { type ItineraryItem } from "@prisma/client";

export async function updateItineraryItem({
  formData,
}: {
  formData: Omit<ItineraryItem, "createdAt">;
}) {
  const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    location: yup.string().required("Location is required"),
    description: yup.string().nullable(),
    notes: yup.string(),
    time: yup.date().required("Time is required"),
  });

  try {
    await validationSchema.validate(formData, { abortEarly: false });

    console.log("EDIT ITINERARY ITEM", formData);

    const updatedItineraryItem = await api.itineraryItem.update({
      id: formData.id,
      title: formData.title ?? undefined,
      location: formData.location ?? undefined,
      description: formData.description ?? null,
      notes: formData.notes ?? undefined,
      time: formData.time ?? undefined,
    });

    if (!updatedItineraryItem) {
      throw new Error("Failed to update the itinerary item");
    }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error("Validation errors:", error.errors);
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
}
