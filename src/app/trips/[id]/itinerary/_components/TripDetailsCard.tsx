"use client";

import { type Trip } from "@prisma/client";
import { differenceInDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import React, { useState } from "react";
import CardMenu from "~/_components/common/CardMenu";
import { Icon } from "~/_components/common/Icon";
import { Typography } from "~/_components/common/Typography";
import { Button } from "~/_components/ui/button";
import { Card, CardContent } from "~/_components/ui/card";
import { Input } from "~/_components/ui/input";
import { DeleteTripButton } from "~/app/trips/_components/DeleteTripButton";
import { Label } from "~/_components/ui/label";
import { api } from "~/trpc/react";
import { DatePicker } from "~/_components/ui/datepicker";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormData = {
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
};

function TripDetailsCard({ trip }: { trip: Trip }) {
  const [isEditing, setIsEditing] = useState(false);
  const utils = api.useUtils();

  const validationSchema = yup.object({
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
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
    },
    resolver: yupResolver(validationSchema),
  });

  const updateTripDetails = api.trip.update.useMutation({
    onSuccess: async () => {
      await utils.trip.getById.invalidate({ id: trip.id });
    },
    onError: (err) => {
      console.error("Error updating trip:", err);
    },
  });

  const onSubmit = async (formData: FormData) => {
    if (!trip?.id) return;

    updateTripDetails.mutate({
      id: trip.id,
      title: formData.title ?? trip.title,
      destination: formData.destination ?? trip.destination,
      startDate: formData.startDate
        ? new Date(formData.startDate)
        : trip.startDate,
      endDate: formData.endDate ? new Date(formData.endDate) : trip.endDate,
    });
    setIsEditing(false);
  };

  return (
    <Card className="w-full rounded-lg border bg-white text-black shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...control.register("title")} />
            </div>
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" {...control.register("destination")} />
            </div>

            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" {...control.register("destination")} />
            </div>

            <div className="flex gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date?.toISOString() ?? "");
                      }}
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date?.toISOString() ?? "");
                      }}
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">Save Details</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <Typography variant="heading1" className="mb-4">
              {trip?.title}
            </Typography>
            <div className="mb-2 flex justify-between">
              <div>
                <Typography variant="label">Destination</Typography>
                <Typography>{trip?.destination}</Typography>
              </div>
              <div>
                <Typography variant="label">Duration:</Typography>
                <div className="flex">
                  <Typography variant="body">
                    {trip?.startDate
                      ? formatInTimeZone(trip.startDate, "UTC", "MMMM d")
                      : "N/A"}
                    {" - "}
                    {trip?.endDate
                      ? formatInTimeZone(trip.endDate, "UTC", "MMMM d, yyyy")
                      : "N/A"}
                  </Typography>
                </div>
              </div>
              <div>
                <Typography variant="label">Countdown</Typography>
                <Typography>
                  {differenceInDays(trip?.startDate, new Date())}{" "}
                  {differenceInDays(trip?.startDate, new Date()) === 1
                    ? "day"
                    : "days"}
                </Typography>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              {trip?.id && (
                <CardMenu>
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setIsEditing(true)}
                    >
                      <Icon
                        name="Pencil"
                        className="text-black dark:text-white"
                        size="20"
                      />
                      Edit Details
                    </Button>
                    <DeleteTripButton id={trip.id} />
                  </>
                </CardMenu>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default TripDetailsCard;
