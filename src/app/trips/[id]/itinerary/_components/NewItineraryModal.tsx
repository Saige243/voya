import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { format } from "date-fns";
import { Checkbox } from "~/_components/ui/checkbox";
import { Label } from "~/_components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/_components/ui/select";
import { Input } from "~/_components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "~/_components/ui/datepicker";
import { Icon } from "~/_components/common/Icon";
import { CustomLocationAutocomplete } from "~/_components/ui/custom-location-autocomplete";

interface ModalProps {
  date?: Date | null;
  onConfirm: (data: ItineraryFormValues) => void | Promise<void>;
}

type ItineraryFormValues = {
  title: string;
  date: Date;
  time: string;
  location: string;
  notes: string;
  isMeal: boolean;
  mealType?: string;
  link: string;
  locationData?: {
    name: string;
    placeId: string;
    formattedAddress: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    googleMapsUrl: string;
  };
};

function NewItineraryModal({ date, onConfirm }: ModalProps) {
  const formattedDate = format(date ?? new Date(), "MMMM d");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ItineraryFormValues>({
    defaultValues: {
      title: "",
      date: date ? date : new Date(),
      time: "",
      location: "",
      notes: "",
      isMeal: false,
      mealType: undefined,
      link: "",
      locationData: undefined,
    },
  });

  const isMealChecked = watch("isMeal");
  const locationValue = watch("location");

  const handleLocationSelect = (locationData: {
    name: string;
    placeId: string;
    formattedAddress: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    googleMapsUrl: string;
  }) => {
    setValue("locationData", locationData);
    if (locationData.googleMapsUrl) {
      setValue("link", locationData.googleMapsUrl);
    }
  };

  const onSubmit = async (data: ItineraryFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await onConfirm(data);
      setOpen(false);
    } catch (err) {
      setError("Couldn't submit item. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="Plus" className="inline" size="16" />
          Add Item for {formattedDate}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Itinerary Item for {formattedDate}</DialogTitle>
        </DialogHeader>
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
                    onChange={(date) =>
                      field.onChange(date?.toISOString() ?? null)
                    }
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
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <CustomLocationAutocomplete
                  id="location"
                  value={field.value}
                  onChange={field.onChange}
                  onLocationSelect={handleLocationSelect}
                  placeholder="Search for a location (e.g., Le Crocodile, Brooklyn)"
                />
              )}
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
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
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
                      <SelectItem value="coffee">Coffee</SelectItem>
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
                <p className="text-sm text-red-500">
                  {errors.mealType.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="link">Link:</Label>
            <Input
              id="link"
              placeholder="Link to more info (auto-filled if location is found)"
              {...register("link")}
            />
            {locationValue && watch("locationData")?.googleMapsUrl && (
              <p className="mt-1 text-sm text-green-600">
                ✓ Google Maps link automatically added
              </p>
            )}
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
            {loading ? "Adding..." : "Add Item"}
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewItineraryModal;
