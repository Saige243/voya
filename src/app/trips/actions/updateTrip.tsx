"use server";

import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { type Trip } from "@prisma/client";

export async function updateTrip({
  formData,
}: {
  formData: Omit<Trip, "createdAt">;
}) {
  const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    destination: yup.string().required("Destination is required"),
    startDate: yup.date().required("Start Date is required"),
    endDate: yup.date().required("End Date is required"),
    description: yup.string().required("Description is required"),
  });

  try {
    await validationSchema.validate(formData, { abortEarly: false });

    console.log("UPDATE TRIP", formData);

    const updatedTrip = await api.trip.update(formData);

    if (!updatedTrip) {
      throw new Error("Failed to update the trip");
    }

    redirect(`/trips/${updatedTrip.id}`);
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
