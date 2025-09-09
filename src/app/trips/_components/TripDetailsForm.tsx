import React from "react";
import { type Trip } from "@prisma/client";
import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";
import { Button } from "~/_components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "~/_components/ui/datepicker";
import { api } from "~/trpc/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormData = {
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
};

type TripDetailsFormProps = {
  trip: Trip;
  onCancel: () => void;
  onSubmitSuccess: () => void;
};

export function TripDetailsForm({
  trip,
  onCancel,
  onSubmitSuccess,
}: TripDetailsFormProps) {
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
    updateTripDetails.mutate({
      id: trip.id,
      title: formData.title,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });
    onSubmitSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...control.register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="destination">Destination</Label>
        <Input id="destination" {...control.register("destination")} />
        {errors.destination && (
          <p className="text-sm text-red-500">{errors.destination.message}</p>
        )}
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
                onChange={(date) => field.onChange(date ?? null)}
              />
            )}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
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
                onChange={(date) => field.onChange(date ?? null)}
              />
            )}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Details</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default TripDetailsForm;
