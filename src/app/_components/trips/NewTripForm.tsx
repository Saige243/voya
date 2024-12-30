import { Button } from "~/app/_components/common/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/app/_components/common/Label";
import { TextInput } from "~/app/_components/common/TextInput";

const NewTripForm = ({ userId }: { userId: string }) => {
  async function createTrip(formData: FormData) {
    "use server";

    const rawFormData = {
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

    const trip = await api.trip.create(rawFormData);
    console.log("Created trip", trip);

    if (!trip) {
      console.error("Error creating trip");
      return;
    }

    redirect(`/trips/${trip.id}`);
  }

  return (
    <form action={createTrip} className="flex flex-col gap-3 text-black">
      <div>
        <Label htmlFor="title">Title:</Label>
        <input
          name="title"
          type="text"
          id="title"
          placeholder="Enter trip title"
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="destination">Destination:</Label>
        <input
          name="destination"
          type="text"
          id="destination"
          placeholder="Enter destination"
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="description">Description:</Label>
        <TextInput
          name="description"
          id="description"
          placeholder="Enter trip description"
          className="w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="startDate">Start Date:</Label>
        <input
          name="startDate"
          type="date"
          id="startDate"
          className="input input-bordered w-full dark:bg-white"
          style={{ colorScheme: "light" }}
        />
      </div>
      <div>
        <Label htmlFor="endDate">End Date:</Label>
        <input
          name="endDate"
          type="date"
          id="endDate"
          className="input input-bordered w-full dark:bg-white"
          style={{ colorScheme: "light" }}
        />
      </div>
      <Button type="submit" className="mt-4">
        Create Trip
      </Button>
    </form>
  );
};

export default NewTripForm;
