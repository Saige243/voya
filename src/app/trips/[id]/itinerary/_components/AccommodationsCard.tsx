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

function AccommodationsCard({
  accommodation,
}: {
  accommodation: Accommodation;
  tripId: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] =
    useState<Partial<Accommodation>>(accommodation);
  const utils = api.useUtils();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateAccommodation = api.accommodation.update.useMutation({
    onSuccess: async () => {
      await utils.accommodation.getAll.invalidate();
    },
    onError: (err) => {
      console.error("Error updating accommodation:", err);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name ?? ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location ?? ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4">
              <div>
                <Label htmlFor="checkIn">Check-In</Label>
                <Input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  value={
                    formData.checkIn
                      ? new Date(formData.checkIn).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-Out</Label>
                <Input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  value={
                    formData.checkOut
                      ? new Date(formData.checkOut).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber ?? ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website ?? ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes ?? ""}
                onChange={handleChange}
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
