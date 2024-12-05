import { Button } from "~/app/_components/ui/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Icon } from "~/app/_components/ui/Icon";
import ItineraryBlock from "../_components/ItineraryBlock";
import { type Accommodation } from "@prisma/client";
import AccommodationList from "../_components/AccommodationList";
import { format } from "date-fns";
import { Label } from "~/app/_components/ui/Label";
import { Typography } from "~/app/_components/ui/Typography";

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

  async function deleteTrip() {
    "use server";
    const { id } = params;
    const tripId = parseInt(id);

    try {
      await api.trip.delete(tripId);
      redirect("/trips");
    } catch (error) {
      console.error("Error deleting trip", error);
    }
  }

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
        <Button className="border-none bg-transparent">
          <Icon
            name="Pencil"
            className="text-black dark:text-white"
            size="20"
          />
        </Button>
      </a>
      <form action={deleteTrip}>
        <Button className="border-none bg-transparent">
          <Icon name="Trash" color="red" size="20" />
        </Button>
      </form>
    </div>
  );

  const tripInfo = (
    <div>
      <h2 className="pb-4 text-xl font-bold">Details:</h2>
      <div className="mb-6 w-full rounded-lg border bg-white p-6 text-black shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="">
          <div>
            <Typography variant="heading1">{trip?.title}</Typography>
            <div className="mb-2">
              {/* <Label htmlFor="destination">Destination:</Label> */}
              <Typography>{trip?.destination}</Typography>
            </div>
            <div className="mb-2">
              {/* <Label htmlFor="description">Description:</Label> */}
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
            {editButtons}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-40">
      <div className="flex flex-col items-center justify-center space-x-6">
        <div className="w-[500px]">{tripInfo}</div>
        <AccommodationList
          tripId={trip?.id}
          accommodations={accommodations}
          deleteTrip={deleteTrip}
        />
      </div>
      <ItineraryBlock trip={trip} itineraries={trip?.itineraries} />
    </main>
  );
}
