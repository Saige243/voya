import { differenceInDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import React from "react";
import { Typography } from "~/_components/common/Typography";
import { type Trip } from "@prisma/client";
import { Icon } from "~/_components/common/Icon";

type DetailItemProps = {
  icon: string;
  label: string;
  children: React.ReactNode;
};

function DetailItem({ icon, label, children }: DetailItemProps) {
  return (
    <div>
      <Typography variant="label" className="mb-1 flex items-center">
        <Icon name={icon} className="mr-1 inline" size="16" />
        {label}
      </Typography>
      <Typography>{children}</Typography>
    </div>
  );
}

function TripDetailsView({ trip }: { trip: Trip }) {
  const daysUntil = differenceInDays(trip?.startDate, new Date());

  return (
    <div>
      <Typography variant="heading1" className="mb-6 flex items-center">
        <Icon name="Text" className="mr-2 inline" size="24" />
        {trip?.title}
      </Typography>
      <div className="mb-2 flex justify-between">
        <DetailItem icon="MapPin" label="Destination">
          {trip?.destination ?? "N/A"}
        </DetailItem>

        <DetailItem icon="Calendar" label="Dates">
          {trip?.startDate
            ? formatInTimeZone(trip.startDate, "UTC", "MMMM d")
            : "N/A"}{" "}
          -{" "}
          {trip?.endDate
            ? formatInTimeZone(trip.endDate, "UTC", "MMMM d, yyyy")
            : "N/A"}
        </DetailItem>

        <DetailItem icon="Clock" label="Countdown">
          {daysUntil} {daysUntil === 1 ? "day" : "days"}
        </DetailItem>
      </div>
    </div>
  );
}

export default TripDetailsView;
