import { Button } from "~/app/_components/ui/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/app/_components/ui/Label";
import { TextInput } from "~/app/_components/ui/TextInput";
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

    const updatedTrip = await api.trip.update(rawFormData);

    if (!updatedTrip) {
      console.error("Error creating trip");
      return;
    }

    redirect(`/trips/${updatedTrip.id}`);
  }

  const editTripForm = (
    <form action={updateTrip} className="flex flex-col gap-3 text-black">
      <div>
        <Label htmlFor="title">Title:</Label>
        <TextInput
          name="title"
          id="title"
          defaultValue={trip.title}
          placeholder={trip.title}
          className="w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="destination">Destination:</Label>
        <TextInput
          name="destination"
          id="destination"
          defaultValue={trip.destination}
          placeholder={trip.destination}
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="description">Description:</Label>
        <TextInput
          name="description"
          id="description"
          defaultValue={trip.description}
          placeholder={trip.description}
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="startDate">Start Date:</Label>
        <input
          name="startDate"
          type="date"
          id="startDate"
          defaultValue={trip.startDate.toISOString().split("T")[0]}
          placeholder={trip.startDate.toISOString().split("T")[0]}
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="endDate">End Date:</Label>
        <input
          name="endDate"
          type="date"
          id="endDate"
          defaultValue={trip.endDate.toISOString().split("T")[0]}
          placeholder={trip.endDate.toISOString().split("T")[0]}
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <Button type="submit" className="mt-4">
        Create Trip
      </Button>
    </form>
  );

  return <div className="flex flex-col gap-4">{editTripForm}</div>;
};

export default EditTripForm;
