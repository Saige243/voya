import { api } from "~/trpc/server";
import { Card, CardContent } from "~/components/ui/card";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import BackButton from "~/app/trips/_components/BackButton";
import ItineraryForm from "../../../../../components/itineraries/ItineraryForm";

export default async function AddItineraryItem({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  async function getTrip() {
    "use server";
    const { id } = params;
    const tripId = parseInt(id);

    const trip = await api.trip.getById({ id: tripId });
    try {
      console.log("trip", trip);
      return trip;
    } catch (error) {
      throw new Error("Trip not found");
    }
  }

  const trip = await getTrip();

  if (!trip) {
    return <div>Trip not found</div>;
  }

  const header = (
    <div className="flex items-center space-x-4 pb-20">
      <BackButton />
      <h1 className="text-2xl font-bold">Edit - {trip?.title}</h1>
    </div>
  );

  const itineraryForm = (
    <Card>
      <CardContent>
        <h2 className="pb-2 text-xl font-bold text-black dark:text-white">
          Add Itinerary Item:
        </h2>
        <ItineraryForm trip={trip} />
      </CardContent>
    </Card>
  );

  return (
    <div>
      {header}
      <main className="flex min-h-screen justify-center">
        <div className="flex flex-col gap-4 md:flex-row">{itineraryForm}</div>
      </main>
    </div>
  );
}
