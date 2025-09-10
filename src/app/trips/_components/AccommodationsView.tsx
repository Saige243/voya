import { format } from "date-fns";
import React from "react";
import { Typography } from "~/_components/common/Typography";
import { type Accommodation } from "@prisma/client";
import { Icon } from "~/_components/common/Icon";

type DetailRowProps = {
  icon: string;
  label: string;
  children: React.ReactNode;
};

function DetailRow({ icon, label, children }: DetailRowProps) {
  return (
    <div className="mb-4">
      <Typography variant="label" className="flex items-center">
        <Icon name={icon} className="mr-1 inline" size="16" />
        {label}
      </Typography>
      <Typography>{children}</Typography>
    </div>
  );
}

function AccommodationsView({
  accommodation,
}: {
  accommodation: Accommodation;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography variant="heading1">{accommodation.name}</Typography>
      </div>

      <Typography variant="label" className="flex items-center">
        <Icon name="MapPin" className="mr-1 inline" size="16" />
        {accommodation.location}
      </Typography>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <DetailRow icon="LogIn" label="Check-In:">
          {format(new Date(accommodation.checkIn), "MMM dd, yyyy")}
        </DetailRow>
        <DetailRow icon="LogOut" label="Check-Out:">
          {format(new Date(accommodation.checkOut), "MMM dd, yyyy")}
        </DetailRow>
      </div>

      {accommodation.notes && (
        <DetailRow icon="StickyNote" label="Notes:">
          {accommodation.notes}
        </DetailRow>
      )}

      {accommodation.phoneNumber && (
        <DetailRow icon="Phone" label="Phone:">
          {accommodation.phoneNumber}
        </DetailRow>
      )}

      {accommodation.website && (
        <div className="mb-4 flex flex-col">
          <Typography variant="label" className="flex items-center">
            <Icon name="Globe" className="mr-1 inline" size="16" />
            Website:
          </Typography>
          <a
            href={accommodation.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:underline"
          >
            {accommodation.name} Website
            <Icon name="ExternalLink" className="ml-1 inline" size="14" />
          </a>
        </div>
      )}
    </div>
  );
}

export default AccommodationsView;
