import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { id: string } }) {
  async function getTrip() {
    "use server";
    const { id } = params;
    const tripId = parseInt(id);

    console.log("IDDDD", tripId);

    const trip = await api.trip.getById({ id: tripId });
    try {
      console.log("trip", trip);
      return trip;
    } catch (error) {
      throw new Error("Trip not found");
    }
  }

  const trip = await getTrip();

  return (
    <main className="flex min-h-screen justify-center">
      <h1>My Trip: {trip?.title}</h1>
    </main>
  );
}
