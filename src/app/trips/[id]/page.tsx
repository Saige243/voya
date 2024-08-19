import { Button } from "~/app/_components/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Icon } from "~/app/_components/Icon";
import ItineraryBlock from "../_components/ItineraryBlock";

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
    try {
      console.log("trip", trip);
      return trip;
    } catch (error) {
      throw new Error("Trip not found");
    }
  }

  const trip = await getTrip();

  async function deleteTrip() {
    "use server";

    const { id } = params;
    const tripId = parseInt(id);

    try {
      await api.trip.delete(tripId);
    } catch (error) {
      console.error("Error deleting trip", error);
    } finally {
      console.log("Deleted trip");
      redirect("/trips");
    }
  }

  const tripInfo = (
    <div className="flex w-1/2 flex-row justify-between">
      <div>
        <h1>My Trip: {trip?.title}</h1>
        <p>Destination: {trip?.destination}</p>
        <p>{trip?.description}</p>
        <p>Start Date: {trip?.startDate?.toString()}</p>
        <p>End Date: {trip?.endDate.toString()}</p>
      </div>
      <div className="flex flex-row justify-end">
        <a href={`/trips/${trip?.id}/edit`}>
          <Button className="border-none  bg-transparent">
            <Icon name="Pencil" color="white" size="20" />
          </Button>
        </a>
        <form action={deleteTrip}>
          <Button className="border-none  bg-transparent">
            <Icon name="Trash" color="red" size="20" />
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-40">
      {tripInfo}
      <ItineraryBlock itineraries={trip?.itineraries} />
    </main>
  );
}
