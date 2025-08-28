import { Button } from "~/_components/ui/button";
import { Icon } from "~/_components/common/Icon";
import { type Trip, type Accommodation } from "@prisma/client";
import { DeleteAccommodationButton } from "./add-accommodation/_components/DeleteAccommodationButton";
import { format, differenceInDays } from "date-fns";
import { Label } from "~/_components/ui/label";
import { Typography } from "~/_components/common/Typography";
import { DeleteTripButton } from "~/app/trips/_components/DeleteTripButton";
import { Card, CardContent } from "~/_components/ui/card";
import CardMenu from "~/_components/common/CardMenu";
import { redirect } from "next/navigation";
import getTrip from "../actions/getTrip";
import getAccommodations from "../actions/getAccommodations";
import DailyItineraryCard from "./itinerary/_components/DailyItineraryCard";

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
                  ? format(new Date(trip.startDate), "MMM dd")
                  : "N/A"}
                {" - "}
              </Typography>
              <Typography variant="body">
                &nbsp;
                {trip?.endDate
                  ? format(new Date(trip.endDate), "dd, yyyy")
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
              {editTripButton(trip.id)}
              <DeleteTripButton id={trip.id} />
            </CardMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="w-full md:w-1/2">{tripDetails}</div>
        {trip && (
          <div className="w-full md:w-1/2">
            <AccommodationList
              tripId={trip.id}
              accommodations={accommodations}
            />
          </div>
        )}
      </div>
      <DailyItineraryCard trip={trip} i={0} />
    </main>
  );
}
