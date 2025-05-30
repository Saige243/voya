"use server";

import { api } from "~/trpc/server";
import * as yup from "yup";
import { type Trip } from "@prisma/client";
import { redirect } from "next/navigation";

export async function createTrip({
  tripData,
}: {
  tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">;
}): Promise<Trip> {
  const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    destination: yup.string().required("Destination is required"),
    startDate: yup.date().required("Start Date is required"),
    endDate: yup.date().required("End Date is required"),
    description: yup.string().optional(),
    userId: yup.string().required("User ID is required"),
  });

  try {
    await validationSchema.validate(tripData, { abortEarly: false });

    const normalizedTripData = {
      ...tripData,
      description: tripData.description ?? undefined, // convert null to undefined
    };

    console.log("CREATE TRIP", tripData);

    const createdTrip = await api.trip.create(normalizedTripData);

    if (!createTrip) {
      throw new Error("Failed to update the trip");
    }

    redirect(`/trips/${createdTrip.id}`);
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
