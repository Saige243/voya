import { Button } from "~/app/_components/common/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/app/_components/common/Label";
import { TextInput } from "~/app/_components/common/TextInput";
import { type Trip } from "@prisma/client";

const ItineraryForm = ({ trip }: { trip: Trip }) => {
  async function addItinerary(formData: FormData) {
    "use server";

    const date = formData.get("datetime") as string;

    const itineraryData = {
      tripId: trip.id,
      title: formData.get("title") as string,
      datetime: new Date(date),
      location: formData.get("location") as string,
      notes: formData.get("notes") as string,
    };

    console.log("itinerary form data ======>", itineraryData);

    const addedItinerary = await api.itinerary.create(itineraryData);

    if (!addedItinerary) {
      console.error("Error adding itinerary");
      return;
    }

    redirect(`/trips/${trip.id}`);
  }

  return (
    <form action={addItinerary} className="flex flex-col gap-3 text-black">
      <div>
        <Label htmlFor="datetime">Date and Time:</Label>
        <input
          name="datetime"
          type="datetime-local"
          id="datetime"
          className="input input-bordered w-full dark:bg-white"
          style={{ colorScheme: "light" }}
        />
      </div>
      <div>
        <Label htmlFor="title">Title:</Label>
        <input
          name="title"
          type="text"
          id="title"
          placeholder="Anniversary trip"
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="location">Location:</Label>
        <TextInput
          name="location"
          id="location"
          placeholder={"Location of the activity"}
          className="w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes:</Label>
        <TextInput
          name="notes"
          id="notes"
          placeholder={"Any additional notes"}
          className="w-full dark:bg-white"
        />
      </div>
      <Button type="submit" className="mt-4">
        Save Itinerary
      </Button>
    </form>
  );
};

export default ItineraryForm;
