import { differenceInDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import React from "react";
import { Typography } from "~/_components/common/Typography";
import { type Trip } from "@prisma/client";

function TripDetailsView({ trip }: { trip: Trip }) {
  return (
    <div>
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
                  ? formatInTimeZone(trip.startDate, "UTC", "MMMM d")
                  : "N/A"}
                {" - "}
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
      </>
    </div>
  );
}

export default TripDetailsView;
