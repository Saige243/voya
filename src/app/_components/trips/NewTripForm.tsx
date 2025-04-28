"use client";

import { Button } from "~/app/_components/common/OldButton";
import { Label } from "~/app/_components/common/Label";
import { createTrip } from "../../trips/actions/createTrip";
import { TextInput } from "~/app/_components/common/TextInput";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { parse } from "date-fns";

type FormData = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  userId: string;
};

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  destination: yup.string().required("Destination is required"),
  description: yup.string().required("Description is required"),
  startDate: yup.string().required("Start Date is required"),
  endDate: yup.string().required("End Date is required"),
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
    const startDate = parse(formData.startDate, "yyyy-MM-dd", new Date());
    const endDate = parse(formData.endDate, "yyyy-MM-dd", new Date());

    const tripData = {
      title: formData.title,
      destination: formData.destination,
      description: formData.description,
      startDate,
      endDate,
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 text-black"
    >
      <div>
        <Label htmlFor="title">Title:</Label>
        <TextInput
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
        <TextInput
          type="text"
          id="destination"
          placeholder="Enter destination"
          className="input input-bordered w-full dark:bg-white"
          {...register("destination", { required: true })}
        />
        {errors.destination && (
          <p className="text-sm text-red-500">{errors.destination.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description:</Label>
        <TextInput
          id="description"
          placeholder="Enter trip description"
          className="w-full dark:bg-white"
          {...register("description", { required: true })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="startDate">Start Date:</Label>
        <input
          type="date"
          id="startDate"
          className="input input-bordered w-full dark:bg-white"
          style={{ colorScheme: "light" }}
          {...register("startDate", { required: true })}
        />
        {errors.startDate && (
          <p className="text-sm text-red-500">{errors.startDate.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="endDate">End Date:</Label>
        <input
          type="date"
          id="endDate"
          className="input input-bordered w-full dark:bg-white"
          style={{ colorScheme: "light" }}
          {...register("endDate", { required: true })}
        />
        {errors.endDate && (
          <p className="text-sm text-red-500">{errors.endDate.message}</p>
        )}
      </div>
      <Button type="submit" className="mt-4">
        Create Trip
      </Button>
    </form>
  );
};

export default NewTripForm;
