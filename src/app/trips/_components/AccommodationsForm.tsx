import { Button } from "~/app/_components/ui/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/app/_components/ui/Label";
import { TextInput } from "~/app/_components/ui/TextInput";
import { type Trip } from "@prisma/client";

const AccommodationsForm = ({
  trip,
  userId,
}: {
  trip: Trip;
  userId: string;
}) => {
  async function addAccommodation(formData: FormData) {
    "use server";

    const rawFormData = {
      tripId: trip.id,
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      checkIn: new Date(formData.get("checkIn") as string),
      checkOut: new Date(formData.get("checkOut") as string),
      notes: formData.get("notes") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      website: formData.get("website") as string,
      userId: userId,
    };

    console.log("accommodation form data ======>", rawFormData);

    const addedAccommodation = await api.accommodation.create(rawFormData);

    if (!addedAccommodation) {
      console.error("Error adding Accommodation");
      return;
    }

    redirect(`/trips/${trip.id}`);
  }

  return (
    <form action={addAccommodation} className="flex flex-col gap-6 text-black">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name" className="block text-sm text-gray-500">
            Name:
          </Label>
          <TextInput
            name="name"
            id="name"
            placeholder="Hotel Name, Airbnb, etc."
            className="mt-1 w-full dark:bg-white"
          />
        </div>

        <div>
          <Label htmlFor="location" className="block text-sm text-gray-500">
            Location:
          </Label>
          <TextInput
            name="location"
            id="location"
            placeholder="City, State, Country"
            className="mt-1 w-full dark:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn" className="block text-sm text-gray-500">
              Check-In Date:
            </Label>
            <input
              name="checkIn"
              type="date"
              id="checkIn"
              className="input input-bordered mt-1 w-full dark:bg-white"
            />
          </div>
          <div>
            <Label htmlFor="checkOut" className="block text-sm text-gray-500">
              Check-Out Date:
            </Label>
            <input
              name="checkOut"
              type="date"
              id="checkOut"
              className="input input-bordered mt-1 w-full dark:bg-white"
              style={{ colorScheme: "light" }}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="block text-sm text-gray-500">
            Notes:
          </Label>
          <TextInput
            name="notes"
            id="notes"
            placeholder="Any additional notes"
            className="mt-1 w-full dark:bg-white"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="block text-sm text-gray-500">
            Phone Number:
          </Label>
          <TextInput
            name="phoneNumber"
            id="phoneNumber"
            placeholder="(123) 456-7890"
            className="mt-1 w-full dark:bg-white"
          />
        </div>

        <div>
          <Label htmlFor="website" className="block text-sm text-gray-500">
            Website:
          </Label>
          <TextInput
            name="website"
            id="website"
            placeholder="www.hotel.com"
            className="mt-1 w-full dark:bg-white"
          />
        </div>
      </div>

      <Button type="submit" className="mt-4">
        Save Stay
      </Button>
    </form>
  );
};

export default AccommodationsForm;
