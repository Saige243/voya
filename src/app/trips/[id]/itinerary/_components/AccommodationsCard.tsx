"use client";

import { Label } from "~/_components/ui/label";
import { format } from "date-fns";
import React, { useState } from "react";
import CardMenu from "~/_components/common/CardMenu";
import { Typography } from "~/_components/common/Typography";
import { Card, CardContent } from "~/_components/ui/card";
import { DeleteAccommodationButton } from "../../add-accommodation/_components/DeleteAccommodationButton";
import { type Accommodation } from "@prisma/client";
import { Button } from "~/_components/ui/button";
import { Icon } from "~/_components/common/Icon";
import { Input } from "~/_components/ui/input";
import { api } from "~/trpc/react";
import { DatePicker } from "~/_components/ui/datepicker";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormData = {
  name: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  notes?: string;
  phoneNumber?: string;
  website?: string;
};

function AccommodationsCard({
  accommodation,
}: {
  accommodation: Accommodation;
  tripId: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(false);
  };

  const editButton = (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => setIsEditing(true)}
    >
      <Icon name="Pencil" className="text-black dark:text-white" size="20" />
      Edit Details
    </Button>
  );

  return (
    <Card>
      <CardContent>
        {isEditing ? (
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
                  <p className="text-sm text-red-500">
                    {errors.checkIn.message}
                  </p>
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
                  <p className="text-sm text-red-500">
                    {errors.checkOut.message}
                  </p>
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
            <div className="flex items-center justify-between">
              <Typography variant="heading1">{accommodation.name}</Typography>
            </div>
            <Typography>{accommodation.location}</Typography>
            <div className="mb-4 mt-4 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="check-in-date">Check-In:</Label>
                <Typography>
                  {format(new Date(accommodation.checkIn), "MMM dd, yyyy")}
                </Typography>
              </div>
              <div>
                <Label htmlFor="check-out-date">Check-Out:</Label>
                <Typography>
                  {format(new Date(accommodation.checkOut), "MMM dd, yyyy")}
                </Typography>
              </div>
            </div>
            {accommodation.notes && (
              <div className="mb-4">
                <Label htmlFor="notes">Notes:</Label>
                <Typography>{accommodation.notes}</Typography>
              </div>
            )}
            {accommodation.phoneNumber && (
              <div className="mb-4">
                <Label htmlFor="phone-number">Phone:</Label>
                <Typography>{accommodation.phoneNumber}</Typography>
              </div>
            )}
            {accommodation.website && (
              <div className="mb-4 flex flex-col">
                <Label htmlFor="website">Website: </Label>
                <a
                  href={accommodation.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {accommodation.name} Website
                </a>
              </div>
            )}
            <div className="mt-2 flex justify-end">
              <CardMenu>
                {editButton}
                <DeleteAccommodationButton accId={accommodation.id} />
              </CardMenu>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default AccommodationsCard;
