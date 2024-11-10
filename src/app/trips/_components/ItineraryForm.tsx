import { Button } from "~/app/_components/ui/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/app/_components/ui/Label";
import { TextInput } from "~/app/_components/ui/TextInput";
import { type Trip } from "@prisma/client";

const ItineraryForm = ({ trip }: { trip: Trip }) => {
  async function addItinerary(formData: FormData) {
    "use server";

    const itineraryData = {
      tripId: trip.id,
      title: formData.get("title") as string,
      date: new Date(formData.get("date") as string),
      time: new Date(formData.get("time") as string),
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
        <Label htmlFor="date">Date:</Label>
        <input
          name="date"
          type="date"
          id="date"
          placeholder={"YYYY-MM-DD"}
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="title">Title:</Label>
        <input
          name="title"
          type="title"
          id="title"
          placeholder="Annivarsary trip"
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="time">Time:</Label>
        <input
          name="time"
          type="time"
          id="time"
          placeholder={"HH:MM"}
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
