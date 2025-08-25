import { Card, CardContent } from "~/_components/ui/card";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import AddAccommodationsForm from "./_components/AddAccommodationsForm";
import AccommodationsForm from "./_components/AccommodationsForm";
import { type Accommodation } from "@prisma/client";
import ShowAccommodationFormButton from "./_components/ShowAccommodationFormButton";
import getTrip from "../../actions/getTrip";

export default async function EditTrip({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  const tripId = params.id;
  const trip = await getTrip(tripId);

  if (!session) {
    redirect("/");
  }

  if (!trip) {
    return <div>Trip not found</div>;
  }

  const accommodations = trip.accommodations || [];

  const header = (
    <div className="flex items-center space-x-4 pb-12">
      <h1 className="text-2xl font-bold">
        Add Accommodations for {trip?.title}
      </h1>
    </div>
  );

  const accommodationForm = (
    <Card className="h-fit">
      <CardContent>
        <h2 className="pb-4 text-xl font-bold text-black dark:text-white">
          Add Accommodations:
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
            Additional Accommodations:
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
