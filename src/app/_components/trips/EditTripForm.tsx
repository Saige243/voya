"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateTrip } from "../../trips/actions/updateTrip"; // Import the server action
import { Label } from "~/app/_components/common/Label";
import { TextInput } from "~/app/_components/common/TextInput";
import { Button } from "~/app/_components/common/Button";
import { type Trip } from "@prisma/client";

type FormData = {
  title: string;
  destination: string;
  startDate: string; // React Hook Form uses strings for date inputs
  endDate: string;
  description: string;
};

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  destination: yup.string().required("Destination is required"),
  startDate: yup.string().required("Start Date is required"),
  endDate: yup.string().required("End Date is required"),
  description: yup.string().required("Description is required"),
});

const EditTripForm = ({ trip, userId }: { trip: Trip; userId: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate.toISOString().split("T")[0],
      endDate: trip.endDate.toISOString().split("T")[0],
      description: trip.description,
    },
  });

  const onSubmit = async (data: FormData) => {
    await updateTrip({ ...data, id, userId });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 text-black"
    >
      <div>
        <Label htmlFor="title">Title:</Label>
        <TextInput
          {...register("title")}
          id="title"
          placeholder="Enter title"
          className="w-full dark:bg-white"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="destination">Destination:</Label>
        <TextInput
          {...register("destination")}
          id="destination"
          placeholder="Enter destination"
          className="w-full dark:bg-white"
        />
        {errors.destination && (
          <p className="text-sm text-red-500">{errors.destination.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description:</Label>
        <TextInput
          {...register("description")}
          id="description"
          placeholder="Enter description"
          className="w-full dark:bg-white"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="startDate">Start Date:</Label>
        <input
          {...register("startDate")}
          type="date"
          id="startDate"
          className="w-full dark:bg-white"
        />
        {errors.startDate && (
          <p className="text-sm text-red-500">{errors.startDate.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="endDate">End Date:</Label>
        <input
          {...register("endDate")}
          type="date"
          id="endDate"
          className="w-full dark:bg-white"
        />
        {errors.endDate && (
          <p className="text-sm text-red-500">{errors.endDate.message}</p>
        )}
      </div>
      <Button type="submit" className="mt-4">
        Save Trip Details
      </Button>
    </form>
  );
};

export default EditTripForm;
