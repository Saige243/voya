import { Button, IconButton } from "~/app/_components/common/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Icon } from "~/app/_components/common/Icon";
import ItineraryBlock from "../../_components/itineraries/ItineraryBlock";
import { type Accommodation } from "@prisma/client";
import AccommodationList from "../../_components/accommodations/AccommodationList";
import { format } from "date-fns";
import { Label } from "~/app/_components/common/Label";
import { Typography } from "~/app/_components/common/Typography";
import BackButton from "../../_components/trips/BackButton";
import { DeleteTripButton } from "~/app/_components/trips/DeleteTripButton";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }

  async function getTrip() {
    "use server";
    const { id } = params;
    const tripId = parseInt(id);

    const trip = await api.trip.getById({ id: tripId });
    if (!trip) {
      throw new Error("Trip not found");
    }
    return trip;
  }

  const trip = await getTrip();

  async function getAccommodations(): Promise<Accommodation[]> {
    "use server";
    const { id } = params;
    const tripId = parseInt(id);

    try {
      const accommodations = await api.accommodation.getAll({ tripId });
      return accommodations;
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      throw new Error("No accommodations found");
    }
  }

  const accommodations = await getAccommodations();

  const editButtons = (
    <div className="flex items-center">
      <a href={`/trips/${trip?.id}/edit`}>
        <IconButton className="border-none bg-transparent">
          <Icon
            name="Pencil"
            className="text-black dark:text-white"
            size="20"
          />
        </IconButton>
      </a>
      <DeleteTripButton id={trip.id} />
    </div>
  );

  const tripInfo = (
    <div>
      <h2 className="pb-4 text-xl font-bold">Overview</h2>
      <div className="mb-6 w-full rounded-lg border bg-white p-6 text-black shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div>
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
          <div className="flex justify-end">{editButtons}</div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-40">
      <div className="flex-start flex w-full items-center text-center">
        <BackButton />
        <h1 className="pl-2 text-2xl font-bold">Trip Details</h1>
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex-col">
          <div className="w-[450px]">{tripInfo}</div>
          <div>
            <ItineraryBlock trip={trip} itineraries={trip?.itineraries} />
          </div>
        </div>
        <div>
          <AccommodationList
            tripId={trip?.id}
            accommodations={accommodations}
          />
        </div>
      </div>
    </main>
  );
}
