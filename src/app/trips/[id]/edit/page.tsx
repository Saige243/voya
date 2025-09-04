import { api } from "~/trpc/server";
import { Card, CardContent } from "~/_components/ui/card";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import EditTripForm from "~/app/trips/_components/EditTripForm";
import AddAccommodationsForm from "../add-accommodation/_components/AddAccommodationsForm";
import AccommodationsForm from "../add-accommodation/_components/AccommodationsForm";
import { type Accommodation } from "@prisma/client";
import ShowAccommodationFormButton from "../add-accommodation/_components/ShowAccommodationFormButton";

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

  const accommodations = trip.accommodations || [];

  const header = (
    <div className="flex items-center space-x-4 pb-8">
      <h1 className="text-2xl font-bold">Edit - {trip?.title}</h1>
    </div>
  );

  const tripDetailsForm = (
    <Card className="lg:w-1/3">
      <CardContent>
        <h2 className="pb-2 text-xl font-bold text-black dark:text-white">
          Trip Details:
        </h2>
        <EditTripForm trip={trip} userId={session.user.id} />
      </CardContent>
    </Card>
  );

  const accommodationForm = (
    <Card className="lg:w-1/3">
      <CardContent>
        <h2 className="pb-2 text-xl font-bold text-black dark:text-white">
          Edit Accommodations:
        </h2>
        {accommodations.length > 0 ? (
          <>
            {accommodations.map((acc: Accommodation) => (
              <AccommodationsForm
                key={acc.id}
                acc={acc}
                userId={session.user.id}
              />
            ))}
          </>
        ) : (
          <AddAccommodationsForm trip={trip} userId={session.user.id} />
        )}
        <div>
          <h2 className="flex content-center justify-center pb-2 pt-6 text-xl font-bold text-black dark:text-white">
            Add Additional Accommodations:
          </h2>
          <ShowAccommodationFormButton trip={trip} userId={session.user.id} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full">
      {header}
      <main className="flex min-h-screen w-full flex-col items-center ">
        <div className="flex w-full flex-col justify-center gap-8 lg:flex-row">
          {tripDetailsForm}
          {accommodationForm}
        </div>
      </main>
    </div>
  );
}
