import { Label } from "~/_components/ui/label";
import { format } from "date-fns";
import React from "react";
import { Typography } from "~/_components/common/Typography";
import { type Accommodation } from "@prisma/client";

function AccommodationsView({
  accommodation,
}: {
  accommodation: Accommodation;
}) {
  return (
    <div>
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
      </>
    </div>
  );
}

export default AccommodationsView;
