import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Icon } from "~/app/_components/common/Icon";
import ItineraryBlock from "../../_components/itineraries/ItineraryBlock";
import { type Accommodation } from "@prisma/client";
import { DeleteAccommodationButton } from "~/app/_components/accommodations/DeleteAccommodationButton";
import { format } from "date-fns";
import { Label } from "~/components/ui/label";
import { Typography } from "~/app/_components/common/Typography";
import BackButton from "../../_components/trips/BackButton";
import { DeleteTripButton } from "~/app/_components/trips/DeleteTripButton";
import { Card, CardContent } from "~/components/ui/card";

type AccommodationListProps = {
  accommodations: Accommodation[];
  tripId: number;
};

async function getTrip(id: string) {
  const tripId = parseInt(id);
  const trip = await api.trip.getById({ id: tripId });
  if (!trip) throw new Error("Trip not found");
  return trip;
}

async function getAccommodations(id: string) {
  const tripId = parseInt(id);
  try {
    return await api.accommodation.getAll({ tripId });
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    throw new Error("No accommodations found");
  }
}

export default async function TripDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const trip = await getTrip(params.id);
  const accommodations = await getAccommodations(trip.id.toString());
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }

  const editButtons = (
    <div className="flex items-center">
      <a href={`/trips/${trip.id}/edit`}>
        <Button variant="ghost">
          <Icon
            name="Pencil"
            className="text-black dark:text-white"
            size="20"
          />
        </Button>
      </a>
      <DeleteTripButton id={trip.id} />
    </div>
  );

  const tripInfo = (
    <Card className="mb-6 w-full rounded-lg border bg-white text-black shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <CardContent>
        <Typography variant="heading1">{trip.title}</Typography>
        <div className="mb-2">
          <Typography>{trip.destination}</Typography>
        </div>
        <div className="mb-2">
          <Typography>{trip.description}</Typography>
        </div>
        <div className="mb-4 mt-4 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-date">Start Date:</Label>
            <Typography>
              {trip.startDate
                ? format(new Date(trip.startDate), "MMM dd, yyyy")
                : "N/A"}
            </Typography>
          </div>
          <div>
            <Label htmlFor="end-date">End Date:</Label>
            <Typography>
              {trip.endDate
                ? format(new Date(trip.endDate), "MMM dd, yyyy")
                : "N/A"}
            </Typography>
          </div>
        </div>
        <div className="mt-8 flex justify-end">{editButtons}</div>
      </CardContent>
    </Card>
  );

  function AccommodationList({
    accommodations,
    tripId,
  }: AccommodationListProps) {
    if (accommodations.length === 0) {
      return (
        <div className="text-center">
          <p className="text-gray-600">No accommodations!</p>
          <Button variant="default">
            <a href={`/trips/${tripId}/add-accommodation`}>Add Accommodation</a>
          </Button>
        </div>
      );
    }

    return (
      <div className="w-full space-y-4">
        {accommodations.map((acc) => (
          <AccommodationCard key={acc.id} accommodation={acc} tripId={tripId} />
        ))}
      </div>
    );
  }

  function AccommodationCard({
    accommodation,
    tripId,
  }: {
    accommodation: Accommodation;
    tripId: number;
  }) {
    const editTripButton = (
      <a href={`/trips/${tripId}/edit`}>
        <Button variant="ghost">
          <Icon
            name="Pencil"
            className="text-black dark:text-white"
            size="20"
          />
        </Button>
      </a>
    );

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
            {editTripButton}
            <DeleteAccommodationButton accId={accommodation.id} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex-start flex w-full items-center text-center">
        <BackButton />
        <h1 className="pl-2 text-2xl font-bold">Trip Details</h1>
      </div>
      <div className="flex flex-col gap-8 pt-12 md:flex-row">
        <div className="flex-col">
          <div className="w-[450px]">{tripInfo}</div>
          <div>
            <ItineraryBlock trip={trip} itineraries={trip.itineraries} />
          </div>
        </div>
        <div>
          <AccommodationList tripId={trip.id} accommodations={accommodations} />
        </div>
      </div>
    </main>
  );
}
