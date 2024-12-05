import { api } from "~/trpc/server";
import { Card } from "../../../_components/ui/Card";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import EditTripForm from "../../_components/EditTripForm";
import AccommodationsForm from "../../_components/AccommodationsForm";
import BackButton from "../../_components/BackButton";
import ItineraryForm from "../../_components/ItineraryForm";

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
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex items-center space-x-4  pb-20 text-center">
        <BackButton />
        <h1 className="text-2xl font-bold">Edit - {trip?.title}</h1>
      </div>
      <div className="flex space-x-4">
        <Card>
          <h2 className="pb-2 text-xl font-bold text-black dark:text-white">
            Trip Details:
          </h2>
          <EditTripForm trip={trip} userId={session.user.id} />
        </Card>
        <Card>
          <h2 className="pb-2 text-xl font-bold text-black dark:text-white">
            Add Accommodations:
          </h2>
          <AccommodationsForm trip={trip} userId={session.user.id} />
        </Card>
        <Card>
          <h2 className="pb-2 text-xl font-bold text-black dark:text-white">
            Add Itinerary:
          </h2>
          <ItineraryForm trip={trip} />
        </Card>
      </div>
    </main>
  );
}
