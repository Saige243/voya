import { Button } from "~/app/_components/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
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
  console.log("Trip", trip);

  async function deleteTrip() {
    "use server";

    const { id } = params;
    const tripId = parseInt(id);
    try {
      await api.trip.delete(tripId);
      redirect(`/trips`);
    } catch (error) {
      console.error("Error deleting trip", error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-40">
      <h1>My Trip: {trip?.title}</h1>
      <p>Destination: {trip?.destination}</p>
      <p>{trip?.description}</p>
      <p>Start Date: {trip?.startDate?.toString()}</p>
      <p>End Date: {trip?.endDate.toString()}</p>
      <div className="pt-20">
        <form action={deleteTrip}>
          <Button>Delete Trip</Button>
        </form>
      </div>
    </main>
  );
}
