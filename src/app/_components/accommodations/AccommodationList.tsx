import { type Accommodation } from "@prisma/client";
import { Label } from "~/app/_components/common/Label";
import { format } from "date-fns";
import { Button } from "~/app/_components/common/Button";
import { Icon } from "~/app/_components/common/Icon";
import { Typography } from "~/app/_components/common/Typography";
import { DeleteAccommodationButton } from "./DeleteAccommodationButton";

type AccommodationListProps = {
  accommodations: Accommodation[];
  tripId: number;
};

export default function AccommodationList({
  accommodations,
  tripId,
}: AccommodationListProps) {
  const accommodationInfo = (acc: Accommodation) => (
    <div
      key={acc.id}
      className="mb-6 max-w-[500px] rounded-lg border bg-white p-6 text-black shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
    >
      <div className="flex items-center justify-between">
        <Typography variant="heading1">{acc.name}</Typography>
      </div>
      <Typography>{acc.location}</Typography>
      <div className="mb-4 mt-4 grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="check-in-date">Check-In:</Label>
          <Typography>
            {format(new Date(acc.checkIn), "MMM dd, yyyy")}
          </Typography>
        </div>
        <div>
          <Label htmlFor="check-out-date">Check-Out:</Label>
          <Typography>
            {format(new Date(acc.checkOut), "MMM dd, yyyy")}
          </Typography>
        </div>
      </div>
      {acc.notes && (
        <div className="mb-4">
          <Label htmlFor="notes">Notes:</Label>
          <Typography>{acc.notes}</Typography>
        </div>
      )}
      {acc.phoneNumber && (
        <div className="mb-4">
          <Label htmlFor="phone-number">Phone:</Label>
          <Typography>{acc.phoneNumber}</Typography>
        </div>
      )}
      {acc.website && (
        <div className="mb-4 flex flex-col">
          <Label htmlFor="website">Website: </Label>
          <a
            href={acc.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {acc.name + " Website"}
          </a>
          <div className="mt-2 flex">
            {editTripButton}
            <DeleteAccommodationButton accId={acc.id} />
          </div>
        </div>
      )}
    </div>
  );

  const editTripButton = (
    <a href={`/trips/${tripId}/edit`}>
      <Button className="border-none bg-transparent">
        <Icon name="Pencil" className="text-black dark:text-white" size="20" />
      </Button>
    </a>
  );

  return (
    <div className="w-full">
      <h2 className="pb-4 text-xl font-bold">Accommodations</h2>
      {accommodations.length > 0 ? (
        <div>
          {accommodations.map((acc) => (
            <div key={acc.id}>{accommodationInfo(acc)}</div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">No accommodations!</p>
          <a
            href={`/trips/${tripId}/edit`}
            className="mt-2 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add Accommodation
          </a>
        </div>
      )}
    </div>
  );
}
