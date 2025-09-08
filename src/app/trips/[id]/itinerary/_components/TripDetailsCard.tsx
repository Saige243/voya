import { type Trip } from "@prisma/client";
import { Label } from "@radix-ui/react-dropdown-menu";
import { differenceInDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import React from "react";
import CardMenu from "~/_components/common/CardMenu";
import { Icon } from "~/_components/common/Icon";
import { Typography } from "~/_components/common/Typography";
import { Button } from "~/_components/ui/button";
import { Card, CardContent } from "~/_components/ui/card";
import { DeleteTripButton } from "~/app/trips/_components/DeleteTripButton";

const editTripDetailsButton = (tripId: number) => (
  <a href={`/trips/${tripId}/edit`}>
    <Button variant="ghost" className="w-full justify-start">
      <Icon name="Pencil" className="text-black dark:text-white" size="20" />
      Edit Details
    </Button>
  </a>
);

function TripDetailsCard({ trip }: { trip: Trip }) {
  return (
    <Card className="w-full rounded-lg border bg-white text-black shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <CardContent>
        <Typography variant="heading1" className="mb-4">
          {trip?.title}
        </Typography>
        <div className="mb-2 flex justify-between">
          <div>
            <Label>Destination</Label>
            <Typography>{trip?.destination}</Typography>
          </div>
          <div>
            <Typography variant="label">Duration:</Typography>
            <div className="flex">
              <Typography variant="body">
                {trip?.startDate
                  ? formatInTimeZone(trip.startDate, "UTC", "MMMM d, yyyy")
                  : "N/A"}
                {" - "}
              </Typography>
              <Typography variant="body">
                &nbsp;
                {trip?.endDate
                  ? formatInTimeZone(trip.endDate, "UTC", "MMMM d, yyyy")
                  : "N/A"}
              </Typography>
            </div>
          </div>
          <div>
            <Label>Countdown</Label>
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
              {editTripDetailsButton(trip.id)}
              <DeleteTripButton id={trip.id} />
            </CardMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TripDetailsCard;
