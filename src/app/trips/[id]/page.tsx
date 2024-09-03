import { Button } from "~/app/_components/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Icon } from "~/app/_components/Icon";
import ItineraryBlock from "../_components/ItineraryBlock";
import { type Accommodation } from "@prisma/client";
import { Label } from "~/app/_components/Label";
import { format } from "date-fns";

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

  async function getAccommodations(): Promise<Accommodation[]> {
    "use server";
    const { id } = params;
    const tripId = parseInt(id);

    try {
      const accommodations = await api.accommodation.getAll({ tripId });
      console.log("accommodations", accommodations);
      return accommodations;
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      throw new Error("No accommodations found");
    }
  }

  const accommodations = await getAccommodations();

  const tripInfo = (
    <div className="flex w-1/2 flex-row justify-between py-2">
      <div>
        <h1 className="pb-1 font-bold">My Trip: {trip?.title}</h1>
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

  const accomodationsInfo = (
    <>
      {accommodations.length > 0 ? (
        <div className="flex w-1/2 flex-row justify-between py-2">
          <div>
            <h2 className="pb-1 font-bold">Accommodations:</h2>
            <ul>
              {accommodations.map((acc) => (
                <li key={acc.id}>
                  <div>
                    <Label htmlFor="name">Name:</Label>
                    <p>{acc.name}</p>
                  </div>
                  <div>
                    <Label htmlFor="location">Location:</Label>
                    <p>{acc.location}</p>
                  </div>
                  <div>
                    <Label htmlFor="check-in-date">Check In Date:</Label>
                    <p>{format(acc.checkIn.toString(), "MMM dd")}</p>
                  </div>
                  <div>
                    <Label htmlFor="check-out-date">Check Out Date:</Label>
                    <p>{format(acc.checkOut.toString(), "MMM dd")}</p>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes:</Label>
                    <p>{acc.notes}</p>
                  </div>
                  <div>
                    <Label htmlFor="phone-number">Phone Number:</Label>
                    <p>{acc.phoneNumber}</p>
                  </div>
                  <div>
                    <Label htmlFor="website">Website:</Label>
                    <p>{acc.website}</p>
                  </div>
                </li>
              ))}
            </ul>
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
      ) : (
        <p>No accommodations</p>
      )}
    </>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-40">
      <div className="flex">
        {tripInfo}
        {accomodationsInfo}
      </div>
      <ItineraryBlock trip={trip} itineraries={trip?.itineraries} />
    </main>
  );
}
