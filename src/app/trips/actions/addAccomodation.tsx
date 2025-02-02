"use server";

import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import * as yup from "yup";
import { type Accommodation } from "@prisma/client";

export async function addAccommodation({
  formData,
}: {
  formData: Omit<Accommodation, "createdAt">;
}) {
  // Define validation schema
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    location: yup.string().required("Location is required"),
    checkIn: yup.date().required("Check-In Date is required"),
    checkOut: yup.date().required("Check-Out Date is required"),
    notes: yup.string(),
    phoneNumber: yup.string().required("Phone Number is required"),
    website: yup.string().required("Website is required"),
  });

  try {
    await validationSchema.validate(formData, { abortEarly: false });

    console.log("ADD ACCOMMODATION", formData);

    // Call the backend API to update the trip
    const updatedTrip = await api.accommodation.create(formData);

    if (!updatedTrip) {
      throw new Error("Failed to update the trip");
    }

    // Redirect to the updated trip's page
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
