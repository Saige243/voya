"use client";

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";
import { Button } from "~/_components/ui/button";
import { type Trip } from "@prisma/client";
import { updateTrip } from "~/app/trips/actions/updateTrip";
import { DatePicker } from "~/_components/ui/datepicker";

type FormData = {
  title: string;
  destination: string;
  startDate: string;
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

const EditTripDetailsForm = ({
  trip,
  userId,
}: {
  trip: Trip;
  userId: string;
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString(),
      description: trip.description ?? "",
    },
  });

  useEffect(() => {
    reset({
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString(),
      description: trip.description ?? "",
    });
  }, [trip, reset]);

  const onSubmit = async (data: FormData) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const newData = {
      ...data,
      startDate,
      endDate,
    };

    try {
      await updateTrip({
        formData: {
          ...newData,
          id: trip.id,
          userId: userId,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating trip:", error.message);
      } else {
        console.error("Error updating trip:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 text-black"
    >
      <div>
        <Label htmlFor="title">Title:</Label>
        <Input
          id="title"
          placeholder={!trip.title ? "Enter title" : ""}
          className="w-full dark:bg-white"
          defaultValue={trip.title}
          {...register("title", { required: true })}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="destination">Destination:</Label>
        <Input
          id="destination"
          placeholder={!trip.destination ? "Enter destination" : ""}
          className="w-full dark:bg-white"
          defaultValue={trip.destination}
          {...register("destination", { required: true })}
        />
        {errors.destination && (
          <p className="text-sm text-red-500">{errors.destination.message}</p>
        )}
      </div>
      <div className="flex flex-row gap-4">
        <div>
          <Label htmlFor="startDate">Start Date:</Label>
          <Controller
            control={control}
            name="startDate"
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date?.toISOString() ?? "")}
              />
            )}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="endDate">End Date:</Label>
          <Controller
            control={control}
            name="endDate"
            rules={{ required: "End date is required" }}
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date?.toISOString() ?? "")}
              />
            )}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description:</Label>
        <Input
          id="description"
          placeholder={!trip.description ? "Enter description" : ""}
          className="w-full dark:bg-white"
          defaultValue={trip.description ?? ""}
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <Button type="submit" className="mt-4">
        Save Trip Details
      </Button>
    </form>
  );
};

export default EditTripDetailsForm;
