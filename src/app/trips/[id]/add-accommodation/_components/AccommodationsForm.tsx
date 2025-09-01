"use client";

import React from "react";
import { Button } from "~/_components/ui/button";
import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";
import { type Accommodation } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { editAccommodation } from "~/app/trips/actions/editAccommodation";
import { DatePicker } from "~/_components/ui/datepicker";

type FormData = {
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  notes?: string;
  phoneNumber: string;
  website: string;
};

const AccommodationsForm = ({
  acc,
  tripStartDate,
  tripEndDate,
}: {
  acc: Accommodation;
  userId: string;
  tripStartDate?: Date;
  tripEndDate?: Date;
}) => {
  const validationSchema = React.useMemo(
    () =>
      yup.object().shape({
        name: yup.string().required("Name is required"),
        location: yup.string().required("Location is required"),
        checkIn: yup
          .string()
          .required("Check-In Date is required")
          .test(
            "check-in-after-trip-start",
            "Check-In Date cannot be before trip start date",
            function (value) {
              if (!value || !tripStartDate) return false;
              const checkInDate = new Date(value);
              return checkInDate >= tripStartDate;
            },
          )
          .test(
            "check-in-before-check-out",
            "Check-In Date cannot be after Check-Out Date",
            function (value) {
              const parent = this.parent as { checkOut?: string };
              if (!value || !parent.checkOut) return true;
              return new Date(value) <= new Date(parent.checkOut);
            },
          ),
        checkOut: yup
          .string()
          .required("Check-Out Date is required")
          .test(
            "check-out-before-trip-end",
            "Check-Out Date cannot be after trip end date",
            function (value) {
              if (!value || !tripEndDate) return false;
              const checkOutDate = new Date(value);
              return checkOutDate <= tripEndDate;
            },
          ),
        notes: yup.string().optional(),
        phoneNumber: yup.string().required("Phone Number is required"),
        website: yup
          .string()
          .required("Website is required")
          .url("Website must be a valid URL (https://example.com)"),
      }),
    [tripStartDate, tripEndDate],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      location: "",
      checkIn: "",
      checkOut: "",
      notes: "",
      phoneNumber: "",
      website: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    const newData = {
      ...data,
      checkIn,
      checkOut,
      notes: data.notes ?? null,
    };

    try {
      await editAccommodation({
        formData: {
          ...newData,
          tripId: acc.tripId,
          id: acc.id,
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
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="location" className="block text-sm ">
            Location:
          </Label>
          <Input
            id="location"
            placeholder="City, State, Country"
            className="mt-1 w-full dark:bg-white"
            {...register("location")}
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn" className="block text-sm ">
              Check-In Date:
            </Label>
            <Controller
              control={control}
              name="checkIn"
              rules={{ required: "Check-In date is required" }}
              render={({ field }) => (
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString() ?? "")}
                />
              )}
            />
            {errors.checkIn && (
              <p className="mt-1 text-xs text-red-500">
                {errors.checkIn.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="checkOut" className="block text-sm ">
              Check-Out Date:
            </Label>
            <Controller
              control={control}
              name="checkOut"
              rules={{ required: "Check-Out date is required" }}
              render={({ field }) => (
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString() ?? "")}
                />
              )}
            />
            {errors.checkOut && (
              <p className="mt-1 text-xs text-red-500">
                {errors.checkOut.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="block text-sm ">
            Notes:
          </Label>
          <Input
            id="notes"
            placeholder="Any additional notes"
            className="mt-1 w-full dark:bg-white"
            {...register("notes")}
          />
          {errors.notes && (
            <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>
          )}
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
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-500">
              {errors.phoneNumber.message}
            </p>
          )}
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
          {errors.website && (
            <p className="mt-1 text-xs text-red-500">
              {errors.website.message}
            </p>
          )}
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
