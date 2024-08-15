import { Button } from "~/app/_components/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/app/_components/Label";
import { TextInput } from "~/app/_components/TextInput";
import { type Trip } from "@prisma/client";

const EditTripForm = ({ trip, userId }: { trip: Trip; userId: string }) => {
  async function updateTrip(formData: FormData) {
    "use server";

    const rawFormData = {
      id: trip.id,
      title: formData.get("title") as string,
      destination: formData.get("destination") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      description: formData.get("description") as string,
      userId: userId,
    };

    if (!rawFormData.title || !rawFormData.description) {
      console.error("Title and description are required");
      return;
    }

    const updatedTrip = await api.trip.update(rawFormData);
    console.log("Created trip", trip);

    if (!updatedTrip) {
      console.error("Error creating trip");
      return;
    }

    redirect(`/trips/${updatedTrip.id}`);
  }

  return (
    <form action={updateTrip} className="flex flex-col gap-3 text-black">
      <div>
        <Label htmlFor="title">Title:</Label>
        <TextInput
          name="title"
          id="title"
          placeholder="title"
          required={true}
          className="w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="destination">Destination:</Label>
        <TextInput
          name="destination"
          id="destination"
          placeholder="destination"
          required
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="description">Description:</Label>
        <TextInput
          name="description"
          id="description"
          placeholder="description"
          required
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="startDate">Start Date:</Label>
        <input
          name="startDate"
          type="date"
          id="startDate"
          required
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="endDate">End Date:</Label>
        <input
          name="endDate"
          type="date"
          id="endDate"
          required
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <Button type="submit" className="mt-4">
        Create Trip
      </Button>
    </form>
  );
};

export default EditTripForm;
