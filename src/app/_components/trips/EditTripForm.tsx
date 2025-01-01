import { Button } from "~/app/_components/common/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/app/_components/common/Label";
import { TextInput } from "~/app/_components/common/TextInput";
import { type Trip } from "@prisma/client";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  destination: yup.string().required("Destination is required"),
  startDate: yup.date().required("Start Date is required"),
  endDate: yup.date().required("End Date is required"),
  description: yup.string().required("Description is required"),
});

const EditTripForm = ({ trip, userId }: { trip: Trip; userId: string }) => {
  async function updateTrip(formData: FormData) {
    "use server";

    const rawFormData = {
      id: trip.id,
      title: formData.get("title") as string,
      destination: formData.get("destination") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      description: formData.get("description") as string,
      userId: userId,
    };

    try {
      // Validate the data
      await validationSchema.validate(rawFormData, { abortEarly: false });

      // Convert start and end dates to proper Date objects
      rawFormData.startDate = new Date(rawFormData.startDate);
      rawFormData.endDate = new Date(rawFormData.endDate);

      const updatedTrip = await api.trip.update(rawFormData);

      if (!updatedTrip) {
        throw new Error("Error updating trip");
      }

      redirect(`/trips/${updatedTrip.id}`);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.reduce(
          (acc, err) => {
            acc[err.path!] = err.message;
            return acc;
          },
          {} as Record<string, string>,
        );
        console.error("Validation errors:", errors);
        // Handle validation errors (e.g., show them in the UI)
        return;
      }
      console.error("Unexpected error:", error);
    }
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
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <Button type="submit" className="mt-4">
        Save Trip Details
      </Button>
    </form>
  );

  return <div className="flex flex-col gap-4">{editTripForm}</div>;
};

export default EditTripForm;
