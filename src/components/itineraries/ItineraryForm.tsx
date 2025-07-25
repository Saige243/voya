import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { type Trip } from "@prisma/client";

const AddItineraryItemForm = ({ trip }: { trip: Trip }) => {
  async function addItinerary(formData: FormData) {
    "use server";

    const rawDateTime = formData.get("datetime") as string;
    // const tripStartDate = trip.startDate;
    // const tripEndDate = trip.endDate;

    if (!rawDateTime || isNaN(new Date(rawDateTime).getTime())) {
      console.error("Invalid date and time provided");
      return;
    }

    const dateTime = new Date(rawDateTime);
    const dateOnly = new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate(),
    );
    const date = dateOnly.toISOString();

    const time = rawDateTime;

    const itinerarItemData = {
      tripId: trip.id,
      title: formData.get("title") as string,
      date: date,
      time: time,
      location: formData.get("location") as string,
      notes: formData.get("notes") as string,
    };

    console.log("Adding itinerary item:", itinerarItemData);
    const addedItineraryItem = await api.itineraryItem.create(itinerarItemData);

    if (!addedItineraryItem) {
      console.error("Error adding itinerary");
      return;
    }

    redirect(`/trips/${trip.id}/itinerary`);
  }

  return (
    <form
      action={addItinerary}
      className="flex w-[500px] flex-col gap-3 text-black"
    >
      <div>
        <Label htmlFor="title">Title:</Label>
        <Input
          name="title"
          type="text"
          id="title"
          placeholder="Gondola Ride"
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="datetime">Date and Time:</Label>
        <Input
          name="datetime"
          type="datetime-local"
          id="datetime"
          className="input input-bordered flex w-full dark:bg-white"
          style={{ colorScheme: "light" }}
        />
      </div>
      <div>
        <Label htmlFor="location">Location:</Label>
        <Input
          name="location"
          id="location"
          placeholder={"Location of the activity"}
          className="w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes:</Label>
        <Input
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

export default AddItineraryItemForm;
