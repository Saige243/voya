import { Button } from "~/components/ui/button";
import { Icon } from "~/components/common/Icon";
import { type Trip, type Accommodation } from "@prisma/client";
import { DeleteAccommodationButton } from "~/components/accommodations/DeleteAccommodationButton";
import { format } from "date-fns";
import { Label } from "~/components/ui/label";
import { Typography } from "~/components/common/Typography";
import BackButton from "~/components/trips/BackButton";
import { DeleteTripButton } from "~/components/trips/DeleteTripButton";
import { Card, CardContent } from "~/components/ui/card";
import CardMenu from "~/components/common/CardMenu";
import { redirect } from "next/navigation";
import getTrip from "../actions/getTrip";
import { ToastHandler } from "~/components/common/Toast";
import getAccommodations from "../actions/getAccommodations";

type AccommodationListProps = {
  accommodations: Accommodation[];
  tripId: number;
};

export default async function TripDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  let trip: Trip | null = null;
  let accommodations: Accommodation[] = [];

  try {
    trip = await getTrip(params.id);
    accommodations = await getAccommodations(params.id);
  } catch (error) {
    console.error(error);
    redirect("/trips");
  }

  if (!trip) redirect("/trips");

  const AccommodationList = ({
    accommodations,
    tripId,
  }: AccommodationListProps) => {
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
  };

  const AccommodationCard = ({
    accommodation,
    tripId,
  }: {
    accommodation: Accommodation;
    tripId: number;
  }) => {
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
              {editTripButton(tripId)}
              <DeleteAccommodationButton accId={accommodation.id} />
            </CardMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  const editTripButton = (tripId: number) => (
    <a href={`/trips/${tripId}/edit`}>
      <Button variant="ghost" className="w-full justify-start">
        <Icon name="Pencil" className="text-black dark:text-white" size="20" />
        Edit Trip
      </Button>
    </a>
  );

  const tripDetails = (
    <Card className="mb-6 w-full rounded-lg border bg-white text-black shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <CardContent>
        <Typography variant="heading1">{trip?.title}</Typography>
        <div className="mb-2">
          <Typography>{trip?.destination}</Typography>
        </div>
        <div className="mb-2">
          <Typography>{trip?.description}</Typography>
        </div>
        <div className="mb-4 mt-4 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-date">Start Date:</Label>
            <Typography>
              {trip?.startDate
                ? format(new Date(trip.startDate), "MMM dd, yyyy")
                : "N/A"}
            </Typography>
          </div>
          <div>
            <Label htmlFor="end-date">End Date:</Label>
            <Typography>
              {trip?.endDate
                ? format(new Date(trip.endDate), "MMM dd, yyyy")
                : "N/A"}
            </Typography>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          {trip?.id && (
            <CardMenu>
              {editTripButton(trip.id)}
              <DeleteTripButton id={trip.id} />
            </CardMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex-start flex w-full items-center text-center">
        <BackButton />
        <h1 className="pl-2 text-2xl font-bold">Dashboard</h1>
      </div>
      <div className="flex flex-col gap-8 pt-12 md:flex-row">
        <div className="flex-col">
          <div className="w-[450px]">{tripDetails}</div>
          {trip && (
            <AccommodationList
              tripId={trip.id}
              accommodations={accommodations}
            />
          )}
        </div>
      </div>
    </main>
  );
}
