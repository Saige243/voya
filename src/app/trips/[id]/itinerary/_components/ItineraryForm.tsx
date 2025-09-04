"use client";

import { Button } from "~/_components/ui/button";
import { api } from "~/trpc/react";
import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";
import { DatePicker } from "~/_components/ui/datepicker";
import { Checkbox } from "~/_components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";
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
  isMeal: boolean;
  mealType?: string;
};

const AddItineraryItemForm = ({ tripId, date }: FormProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<ItineraryFormValues>({
    defaultValues: {
      title: "",
      date: date,
      time: "",
      location: "",
      notes: "",
      isMeal: false,
      mealType: undefined,
    },
  });

  const isMealChecked = watch("isMeal");

  const createItineraryItem = api.itineraryItem.create.useMutation({
    onSuccess: (data) => {
      console.log("Itinerary item created", data);
      reset();
    },
    onError: (err) => {
      console.error("Error creating itinerary item:", err);
    },
  });

  const onSubmit = (data: ItineraryFormValues) => {
    const [hours, minutes] = data.time.split(":").map(Number);

    const combined = set(data.date, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    });

    console.log("Submitting local datetime", combined);

    createItineraryItem.mutate({
      tripId,
      title: data.title,
      date: data.date,
      time: combined,
      location: data.location,
      notes: data.notes,
      isMeal: data.isMeal,
      mealType: data.mealType,
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

      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="isMeal"
          render={({ field }) => (
            <Checkbox
              id="isMeal"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
        <Label htmlFor="isMeal">Meal?</Label>
      </div>

      {isMealChecked && (
        <div>
          <Label htmlFor="mealType">Meal Type:</Label>
          <Controller
            control={control}
            name="mealType"
            rules={{ required: "Please select a meal type" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a meal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="brunch">Brunch</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.mealType && (
            <p className="text-sm text-red-500">{errors.mealType.message}</p>
          )}
        </div>
      )}

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
