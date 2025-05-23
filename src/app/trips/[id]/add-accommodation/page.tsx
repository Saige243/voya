import { api } from "~/trpc/server";
import { Card, CardContent } from "~/components/ui/card";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import AddAccommodationsForm from "../../../_components/accommodations/AddAccommodationsForm";
import AccommodationsForm from "../../../_components/accommodations/AccommodationsForm";
import BackButton from "../../../_components/trips/BackButton";
import { type Accommodation } from "@prisma/client";
import ShowAccommodationFormButton from "~/app/_components/accommodations/ShowAccommodationFormButton";

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
    <div className="flex items-center space-x-4 pb-20">
      <BackButton />
      <h1 className="text-2xl font-bold">Edit - {trip?.title}</h1>
    </div>
  );

  const accommodationForm = (
    <Card className="h-fit">
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
            Add Accommodations:
          </h2>
          <ShowAccommodationFormButton trip={trip} userId={session.user.id} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      {header}
      <main className="flex min-h-screen justify-center">
        <div className="flex flex-col gap-4 md:flex-row">
          {accommodationForm}
        </div>
      </main>
    </div>
  );
}
