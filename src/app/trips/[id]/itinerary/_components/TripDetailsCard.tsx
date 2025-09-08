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

function TripDetailsCard({ trip }: { trip: Trip }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Trip>>(trip);
  const utils = api.useUtils();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateTripDetails = api.trip.update.useMutation({
    onSuccess: async () => {
      await utils.trip.getById.invalidate({ id: trip.id });
    },
    onError: (err) => {
      console.error("Error updating trip:", err);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title ?? ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination ?? ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={
                    formData.startDate
                      ? new Date(formData.startDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={
                    formData.endDate
                      ? new Date(formData.endDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>
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
                      ? formatInTimeZone(trip.startDate, "UTC", "MMMM d, yyyy")
                      : "N/A"}{" "}
                    -{" "}
                  </Typography>
                  <Typography variant="body">
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
