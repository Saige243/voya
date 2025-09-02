"use client";

import { Button } from "~/_components/ui/button";
import { api } from "~/trpc/react";
import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";
import { DatePicker } from "~/_components/ui/datepicker";
import { Controller, useForm } from "react-hook-form";
import { set } from "date-fns";

interface FormProps {
  tripId: number;
  date: Date;
}

type ItineraryFormValues = {
  title: string;
  date: Date;
  time: string;
  location: string;
  notes: string;
};

const AddItineraryItemForm = ({ tripId, date }: FormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ItineraryFormValues>({
    defaultValues: {
      title: "",
      date: date,
      time: "",
      location: "",
      notes: "",
    },
  });

  const createItineraryItem = api.itineraryItem.create.useMutation({
    onSuccess: () => {
      console.log("Itinerary item created");
      reset();
    },
    onError: (err) => {
      console.error("Error creating itinerary item:", err);
    },
  });

  const onSubmit = (data: ItineraryFormValues) => {
    const [hours, minutes] = data.time.split(":").map(Number);

    // Combine the date and time in local time
    const combined = set(data.date, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    });

    // Convert to ISO string in UTC
    const datetimeUTC = combined.toISOString();

    console.log("UTC datetime to submit:", datetimeUTC);

    createItineraryItem.mutate({
      tripId,
      title: data.title,
      date: combined.toISOString(),
      location: data.location,
      notes: data.notes,
    });
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
          placeholder="Gondola Ride"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <Label htmlFor="datetime">Date and Time:</Label>
      <div className="flex flex-row items-center gap-2">
        <div className="w-1/2">
          <Controller
            control={control}
            name="date"
            rules={{ required: "Date and time are required" }}
            render={({ field }) => (
              <DatePicker
                disabled
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date?.toISOString() ?? null)}
              />
            )}
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="w-1/2">
          <Input
            id="time"
            type="time"
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            {...register("time")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location:</Label>
        <Input
          id="location"
          placeholder="Location of the activity"
          {...register("location")}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes:</Label>
        <Input
          id="notes"
          placeholder="Any additional notes"
          {...register("notes")}
        />
      </div>

      <Button type="submit" className="mt-4">
        Save Itinerary
      </Button>
    </form>
  );
};

export default AddItineraryItemForm;
