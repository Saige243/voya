import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";
import React from "react";
import { Button } from "~/_components/ui/button";
import { Controller } from "react-hook-form";
import { DatePicker } from "~/_components/ui/datepicker";
import { api } from "~/trpc/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { type Accommodation } from "@prisma/client";

type FormData = {
  name: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  notes?: string;
  phoneNumber?: string;
  website?: string;
};

function AccommodationsForm({
  accommodation,
  onSuccessfulSubmit,
  onCancel,
}: {
  accommodation: Accommodation;
  onSuccessfulSubmit: () => void;
  onCancel: () => void;
}) {
  const utils = api.useUtils();

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    location: yup.string().required("Location is required"),
    checkIn: yup.date().required("Check-In date is required"),
    checkOut: yup
      .date()
      .required("Check-Out date is required")
      .min(yup.ref("checkIn"), "Check-Out cannot be before Check-In"),
    phoneNumber: yup.string().optional(),
    website: yup.string().url("Must be a valid URL").optional(),
    notes: yup.string().optional(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: accommodation.name,
      location: accommodation.location,
      checkIn: new Date(accommodation.checkIn),
      checkOut: new Date(accommodation.checkOut),
      phoneNumber: accommodation.phoneNumber ?? "",
      website: accommodation.website ?? "",
      notes: accommodation.notes ?? "",
    },
    resolver: yupResolver(validationSchema),
  });

  const updateAccommodation = api.accommodation.update.useMutation({
    onSuccess: async () => {
      await utils.accommodation.getAll.invalidate();
      onSuccessfulSubmit();
    },
    onError: (err) => {
      console.error("Error updating accommodation:", err);
    },
  });

  const onSubmit = async (formData: FormData) => {
    if (!accommodation.id) return;

    updateAccommodation.mutate({
      ...formData,
      id: accommodation.id,
      notes: formData.notes ?? undefined,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...control.register("name", { value: accommodation.name })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...control.register("location", {
            value: accommodation.location,
          })}
        />
      </div>

      <div className="flex gap-4">
        <div>
          <Label htmlFor="checkIn">Check-In</Label>
          <Controller
            control={control}
            name="checkIn"
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={(date) => {
                  field.onChange(date?.toISOString() ?? "");
                }}
              />
            )}
          />
          {errors.checkIn && (
            <p className="text-sm text-red-500">{errors.checkIn.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="checkOut">Check-Out</Label>
          <Controller
            control={control}
            name="checkOut"
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={(date) => {
                  field.onChange(date?.toISOString() ?? "");
                }}
              />
            )}
          />
          {errors.checkOut && (
            <p className="text-sm text-red-500">{errors.checkOut.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="phoneNumber">Phone</Label>
        <Input
          id="phoneNumber"
          {...control.register("phoneNumber", {
            value: accommodation.phoneNumber,
          })}
        />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          {...control.register("website", {
            value: accommodation.website,
          })}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          {...control.register("notes", {
            value: accommodation.notes ?? "",
          })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={() => onCancel()} variant="ghost">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default AccommodationsForm;
