"use server";

import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { Trip } from "@prisma/client";

export async function updateTrip({
  formData,
  tripId,
  userId,
}: {
  formData: Trip;
  tripId: string;
  userId: string;
}) {
  // Define validation schema
  const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    destination: yup.string().required("Destination is required"),
    startDate: yup.date().required("Start Date is required"),
    endDate: yup.date().required("End Date is required"),
    description: yup.string().required("Description is required"),
  });

  try {
    // Validate formData
    await validationSchema.validate(formData, { abortEarly: false });

    const parsedFormData = {
      ...formData,
      userId,
      tripId,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    };
    console.log("UPDATE TRIP", parsedFormData);

    // Call the backend API to update the trip
    // const updatedTrip = await api.trip.update(parsedFormData);

    // if (!updatedTrip) {
    //   throw new Error("Failed to update the trip");
    // }

    // Redirect to the updated trip's page
    // redirect(`/trips/${updatedTrip.id}`);
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
