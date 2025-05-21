"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateTrip } from "../../trips/actions/updateTrip";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/Input";
import { Button } from "~/app/_components/common/OldButton";
import { type Trip } from "@prisma/client";

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
    handleSubmit,
    formState: { errors },
    reset,
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

  useEffect(() => {
    reset({
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate.toISOString().split("T")[0],
      endDate: trip.endDate.toISOString().split("T")[0],
      description: trip.description,
    });
  }, [trip, reset]);

  const onSubmit = async (data: FormData) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    console.log("Errors:", errors);
    console.log("Data:", data);
    console.log("TRIP:", trip);

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    // const newData = {
    //   ...data,
    //   startDate,
    //   endDate,
    // };
    // console.log("New Data:", newData);

    // try {
    //   await updateTrip({
    //     formData: {
    //       ...newData,
    //       id: trip.id,
    //       userId: userId,
    //     },
    //   });
    // } catch (error) {
    //   console.error("Error updating trip:", error);
    // }
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
      <div>
        <Label htmlFor="description">Description:</Label>
        <Input
          id="description"
          placeholder={!trip.description ? "Enter description" : ""}
          className="w-full dark:bg-white"
          defaultValue={trip.description}
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="startDate">Start Date:</Label>
        <Input
          type="date"
          id="startDate"
          className="w-full dark:bg-white"
          defaultValue={trip.startDate.toISOString().split("T")[0]}
          {...register("startDate", { required: true })}
        />
        {errors.startDate && (
          <p className="text-sm text-red-500">{errors.startDate.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="endDate">End Date:</Label>
        <Input
          type="date"
          id="endDate"
          className="w-full dark:bg-white"
          defaultValue={trip.endDate.toISOString().split("T")[0]}
          {...register("endDate", { required: true })}
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

export default EditTripDetailsForm;
