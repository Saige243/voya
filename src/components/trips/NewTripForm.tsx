"use client";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { createTrip } from "~/app/trips/actions/createTrip";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "~/components/ui/card";
import { yupResolver } from "@hookform/resolvers/yup";
import { parse } from "date-fns";
import { Input } from "~/components/ui/input";

type FormData = {
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  userId: string;
};

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  destination: yup.string().required("Destination is required"),
  startDate: yup.date().required("Start Date is required"),
  endDate: yup
    .date()
    .required("End Date is required")
    .min(yup.ref("startDate"), "End Date cannot be before Start Date")
    .test(
      "max-trip-length",
      "Trip cannot be longer than 30 days",
      function (value) {
        const { startDate } = this.parent as { startDate?: Date };
        if (!value || !startDate) return true;

        const diff =
          (value.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 30;
      },
    ),
  description: yup.string().optional(),
  userId: yup.string().required("User ID is required"),
});

const NewTripForm = ({ userId }: { userId: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: { userId },
  });

  async function onSubmit(formData: FormData) {
    const tripData = {
      title: formData.title,
      destination: formData.destination,
      description: formData.description ?? null,
      startDate: formData.startDate,
      endDate: formData.endDate,
      userId,
    };

    console.log("tripData", tripData);
    console.log("errors", errors);

    try {
      await createTrip({
        tripData,
      });
    } catch (error) {
      console.error("Error creating trip:", error);
      return;
    }
  }

  return (
    <Card className="w-full max-w-lg bg-white dark:bg-gray-800">
      <CardContent className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Create New Trip</h2>
        <p className="text-sm text-gray-500">
          Fill in the details below to create a new trip.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 text-black"
        >
          <div>
            <Label htmlFor="title">Title:</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter trip title"
              className="input input-bordered w-full dark:bg-white"
              {...register("title", { required: true })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="destination">Destination:</Label>
            <Input
              type="text"
              id="destination"
              placeholder="Enter destination"
              className="input input-bordered w-full dark:bg-white"
              {...register("destination", { required: true })}
            />
            {errors.destination && (
              <p className="text-sm text-red-500">
                {errors.destination.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description:</Label>
            <Input
              id="description"
              placeholder="Enter trip description"
              className="w-full dark:bg-white"
              {...register("description", { required: true })}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="startDate">Start Date:</Label>
            <Input
              type="date"
              id="startDate"
              className="input input-bordered w-full dark:bg-white"
              style={{ colorScheme: "light" }}
              {...register("startDate", {
                required: true,
                valueAsDate: true,
              })}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date:</Label>
            <Input
              type="date"
              id="endDate"
              className="input input-bordered w-full dark:bg-white"
              style={{ colorScheme: "light" }}
              {...register("endDate", {
                required: true,
                valueAsDate: true,
              })}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>
          <Button type="submit" className="mt-4">
            Create Trip
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewTripForm;
