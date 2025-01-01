import { Button } from "~/app/_components/common/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/app/_components/common/Label";
import { TextInput } from "~/app/_components/common/TextInput";
import { type Trip } from "@prisma/client";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  destination: yup.string().required("Destination is required"),
  startDate: yup.date().required("Start Date is required"),
  endDate: yup.date().required("End Date is required"),
  description: yup.string().required("Description is required"),
});

type FormData = {
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  description: string;
};

const EditTripForm = ({ trip, userId }: { trip: Trip; userId: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      description: trip.description,
    },
  });

  async function updateTrip(formData: FormData) {
    "use server";

    const rawFormData = {
      id: trip.id,
      title: formData.title,
      destination: formData.destination,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      description: formData.description,
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
    <form
      onSubmit={handleSubmit(updateTrip)}
      className="flex flex-col gap-3 text-black"
    >
      <div>
        <Label htmlFor="title">Title:</Label>
        <TextInput
          {...register("title")}
          id="title"
          placeholder="Enter title"
          className="w-full dark:bg-white"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="destination">Destination:</Label>
        <TextInput
          {...register("destination")}
          id="destination"
          placeholder="Enter destination"
          className="w-full dark:bg-white"
        />
        {errors.destination && (
          <p className="text-sm text-red-500">{errors.destination.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description:</Label>
        <TextInput
          {...register("description")}
          id="description"
          placeholder="Enter description"
          className="w-full dark:bg-white"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="startDate">Start Date:</Label>
        <input
          {...register("startDate")}
          type="date"
          id="startDate"
          className="w-full dark:bg-white"
        />
        {errors.startDate && (
          <p className="text-sm text-red-500">{errors.startDate.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="endDate">End Date:</Label>
        <input
          {...register("endDate")}
          type="date"
          id="endDate"
          className="w-full dark:bg-white"
        />
        {errors.endDate && (
          <p className="text-sm text-red-500">{errors.endDate.message}</p>
        )}
      </div>
      <Button type="submit" className="mt-4">
        Save Trip Details
      </Button>
    </form>
  );

  return <div className="flex flex-col gap-4">{editTripForm}</div>;
};

export default EditTripForm;
