import { Button } from "~/app/_components/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Icon } from "~/app/_components/Icon";
import ItineraryBlock from "../_components/ItineraryBlock";
import { type Accommodation } from "@prisma/client";
import AccommodationList from "../_components/AccommodationList";
import { format } from "date-fns";
import { Label } from "~/app/_components/Label";

// Main page component
export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }

  // Fetch the trip details
  async function getTrip() {
    "use server"; // Ensure this function runs on the server
    const { id } = params;
    const tripId = parseInt(id);

    const trip = await api.trip.getById({ id: tripId });
    if (!trip) {
      throw new Error("Trip not found");
    }
    return trip;
  }

  const trip = await getTrip();

  // Handle trip deletion
  async function deleteTrip() {
    "use server"; // Ensure this function runs on the server
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
    <div className="flex items-center space-x-2">
      <a href={`/trips/${trip?.id}/edit`}>
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
  );

  const tripInfo = (
    <div>
      <h2 className="pb-4 text-xl font-bold">Details:</h2>
      <div className="mb-6 w-full rounded-lg border bg-white p-6 text-black shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="pb-2 text-2xl font-bold dark:text-white">
              My Trip: {trip?.title}
            </h1>
            <div className="mb-2">
              <Label htmlFor="destination">Destination:</Label>
              <p className="text-sm text-gray-400">{trip?.destination}</p>
            </div>
            <div className="mb-2">
              <Label htmlFor="description">Description:</Label>
              <p className="text-sm text-gray-400">{trip?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date:</Label>
                <p className="text-sm text-gray-400">
                  {trip?.startDate
                    ? format(new Date(trip.startDate), "MMM dd, yyyy")
                    : "N/A"}
                </p>
              </div>
              <div>
                <Label htmlFor="end-date">End Date:</Label>
                <p className="text-sm text-gray-400">
                  {trip?.endDate
                    ? format(new Date(trip.endDate), "MMM dd, yyyy")
                    : "N/A"}
                </p>
              </div>
              {editButtons}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-40">
      <div className="flex space-x-6">
        <div>{tripInfo}</div>
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
