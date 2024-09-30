// AccommodationList.tsx
import { type Accommodation } from "@prisma/client";
import { Label } from "~/app/_components/Label";
import { format } from "date-fns";
import { Button } from "~/app/_components/Button";
import { Icon } from "~/app/_components/Icon";

type AccommodationListProps = {
  accommodations: Accommodation[];
  tripId: number;
  deleteTrip: () => Promise<void>;
};

export default function AccommodationList({
  accommodations,
  tripId,
  deleteTrip,
}: AccommodationListProps) {
  return (
    <div className="w-full">
      <h2 className="pb-4 text-xl font-bold">Accommodations</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accommodations.map((acc) => (
          <div
            key={acc.id}
            className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg"
          >
            <div className="mb-2 flex justify-between">
              <h3 className="text-lg font-semibold">{acc.name}</h3>
              <a href={`/trips/${tripId}/edit`}>
                <Button className="border-none bg-transparent">
                  <Icon name="Pencil" color="white" size="20" />
                </Button>
              </a>
            </div>
            <p className="mb-2 text-sm text-gray-400">{acc.location}</p>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="check-in-date">Check-In:</Label>
                <p>{format(new Date(acc.checkIn), "MMM dd, yyyy")}</p>
              </div>
              <div>
                <Label htmlFor="check-out-date">Check-Out:</Label>
                <p>{format(new Date(acc.checkOut), "MMM dd, yyyy")}</p>
              </div>
            </div>
            {acc.notes && (
              <div className="mb-2">
                <Label htmlFor="notes">Notes:</Label>
                <p>{acc.notes}</p>
              </div>
            )}
            {acc.phoneNumber && (
              <div className="mb-2">
                <Label htmlFor="phone-number">Phone:</Label>
                <p>{acc.phoneNumber}</p>
              </div>
            )}
            {acc.website && (
              <div className="mb-2">
                <Label htmlFor="website">Website:</Label>
                <a
                  href={acc.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {acc.website}
                </a>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <form action={deleteTrip}>
                <Button className="border-none bg-transparent">
                  <Icon name="Trash" color="red" size="20" />
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
