// AccommodationList.tsx
import { type Accommodation } from "@prisma/client";
import { Label } from "~/app/_components/ui/Label";
import { format } from "date-fns";
import { Button } from "~/app/_components/ui/Button";
import { Icon } from "~/app/_components/ui/Icon";

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
            className="rounded-lg border bg-white p-6 text-black shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{acc.name}</h3>
            </div>
            <p className="mb-2 text-sm text-gray-400">{acc.location}</p>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="check-in-date">Check-In:</Label>
                <p className="text-sm text-gray-400">
                  {format(new Date(acc.checkIn), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <Label htmlFor="check-out-date">Check-Out:</Label>
                <p className="text-sm text-gray-400">
                  {format(new Date(acc.checkOut), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
            {acc.notes && (
              <div className="mb-4">
                <Label htmlFor="notes">Notes:</Label>
                <p className="text-sm text-gray-400">{acc.notes}</p>
              </div>
            )}
            {acc.phoneNumber && (
              <div className="mb-4">
                <Label htmlFor="phone-number">Phone:</Label>
                <p className="text-sm text-gray-400">{acc.phoneNumber}</p>
              </div>
            )}
            {acc.website && (
              <div className="mb-4">
                <Label htmlFor="website">Website: </Label>
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
            <div className="flex justify-end">
              <a href={`/trips/${tripId}/edit`}>
                <Button className="border-none bg-transparent">
                  <Icon name="Pencil" color="black" size="20" />
                </Button>
              </a>
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
