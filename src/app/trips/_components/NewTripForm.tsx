import { Button } from "~/app/_components/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/app/_components/Label";
import { TextInput } from "~/app/_components/TextInput";

const NewTripForm = ({ userId }: { userId: string }) => {
  async function createTrip(formData: FormData) {
    "use server";

    const rawFormData = {
      title: formData.get("title") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      description: formData.get("description") as string,
      userId: userId,
    };

    if (!rawFormData.title || !rawFormData.description) {
      console.error("Title and description are required");
      return;
    }

    try {
      const trip = await api.trip.create(rawFormData);
      redirect(`/trips/${trip.id}`);
    } catch (error) {
      console.error("Error creating trip", error);
    }
  }

  return (
    <form action={createTrip} className="flex flex-col gap-3 text-black">
      <div>
        <Label htmlFor="title">Title:</Label>
        <TextInput
          name="title"
          id="title"
          defaultValue="title"
          required={true}
          className="w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="description">Description:</Label>
        <TextInput
          name="description"
          id="description"
          defaultValue="description"
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
          defaultValue="startDate"
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
          defaultValue="endDate"
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

export default NewTripForm;
