"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
// import { DatePicker } from "~/components/ui/datepicker";
import { type Accommodation } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { editAccommodation } from "~/app/trips/actions/editAccommodation";

type FormData = {
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  notes: string;
  phoneNumber: string;
  website: string;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  location: yup.string().required("Location is required"),
  checkIn: yup.string().required("Check-In Date is required"),
  checkOut: yup.string().required("Check-Out Date is required"),
  notes: yup.string().required("Notes are required"),
  phoneNumber: yup.string().required("Phone Number is required"),
  website: yup.string().required("Website is required"),
});

const AccommodationsForm = ({
  acc,
  userId,
}: {
  acc: Accommodation;
  userId: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: acc.name,
      location: acc.location,
      checkIn: acc.checkIn.toISOString().split("T")[0],
      checkOut: acc.checkOut.toISOString().split("T")[0],
      notes: acc.notes,
      phoneNumber: acc.phoneNumber,
      website: acc.website,
    },
  });

  const onSubmit = async (data: FormData) => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    console.log("Errors:", errors);
    console.log("Data:", data);
    console.log("TRIP:", acc);

    const newData = {
      ...data,
      checkIn,
      checkOut,
    };
    console.log("New Data:", newData);

    try {
      await editAccommodation({
        formData: {
          ...newData,
          tripId: acc.tripId,
          id: Number(userId),
        },
      });
    } catch (error) {
      console.error("Unexpected error on accommodation:", error);
      throw error;
    }
  };

  const accomodationForm = (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 text-black"
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name" className="block text-sm ">
            Name:
          </Label>
          <Input
            id="name"
            placeholder="Hotel Name, Airbnb, etc."
            className="mt-1 w-full dark:bg-white"
            {...register("name")}
          />
        </div>

        <div>
          <Label htmlFor="location" className="block text-sm ">
            Location:
          </Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="City, State, Country"
            className="mt-1 w-full dark:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn" className="block text-sm ">
              Check-In Date:
            </Label>
            <Input
              id="checkIn"
              type="date"
              className="w-full dark:bg-white"
              {...register("checkIn")}
            />
          </div>
          <div>
            <Label htmlFor="checkOut" className="block text-sm ">
              Check-Out Date:
            </Label>
            <Input
              id="checkOut"
              type="date"
              className="w-full dark:bg-white"
              {...register("checkOut", { required: true })}
              // style={{ colorScheme: "light" }}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="block text-sm ">
            Notes:
          </Label>
          <Input
            id="notes"
            {...register("notes")}
            placeholder="Any additional notes"
            className="mt-1 w-full dark:bg-white"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="block text-sm ">
            Phone Number:
          </Label>
          <Input
            id="phoneNumber"
            placeholder="(123) 456-7890"
            {...register("phoneNumber")}
            className="mt-1 w-full dark:bg-white"
          />
        </div>

        <div>
          <Label htmlFor="website" className="block text-sm ">
            Website:
          </Label>
          <Input
            id="website"
            {...register("website")}
            placeholder="www.hotel.com"
            className="mt-1 w-full dark:bg-white"
          />
        </div>
      </div>

      <Button type="submit" className="my-4">
        Save Accommodation
      </Button>
    </form>
  );

  return <div className="flex flex-col gap-4">{accomodationForm}</div>;
};

export default AccommodationsForm;
