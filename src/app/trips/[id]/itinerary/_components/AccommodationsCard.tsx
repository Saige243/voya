import { Label } from "~/_components/ui/label";
import { format } from "date-fns";
import React from "react";
import CardMenu from "~/_components/common/CardMenu";
import { Typography } from "~/_components/common/Typography";
import { Card, CardContent } from "~/_components/ui/card";
import { DeleteAccommodationButton } from "../../add-accommodation/_components/DeleteAccommodationButton";
import { type Accommodation } from "@prisma/client";
import { Button } from "~/_components/ui/button";
import { Icon } from "~/_components/common/Icon";

const editTripDetailsButton = (tripId: number) => (
  <a href={`/trips/${tripId}/edit`}>
    <Button variant="ghost" className="w-full justify-start">
      <Icon name="Pencil" className="text-black dark:text-white" size="20" />
      Edit Details
    </Button>
  </a>
);

function AccommodationsCard({
  accommodation,
  tripId,
}: {
  accommodation: Accommodation;
  tripId: number;
}) {
  return (
    <Card>
      <CardContent>
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
            {editTripDetailsButton(tripId)}
            <DeleteAccommodationButton accId={accommodation.id} />
          </CardMenu>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccommodationsCard;
