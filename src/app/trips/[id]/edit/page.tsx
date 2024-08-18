import { api } from "~/trpc/server";
import { Card } from "../../../_components/Card";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import EditTripForm from "../../_components/EditTripForm";

export default async function EditTrip({ params }: { params: { id: string } }) {
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

  return (
    <main className="flex min-h-screen flex-col items-center ">
      <h1 className="pb-20 text-center">Edit: {trip?.title}</h1>
      <Card>
        <EditTripForm trip={trip} userId={session.user.id} />
      </Card>
    </main>
  );
}
