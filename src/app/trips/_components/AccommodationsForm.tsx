import { Button } from "~/app/_components/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Label } from "~/app/_components/Label";
import { TextInput } from "~/app/_components/TextInput";
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

    console.log("accomodation form data ======>", rawFormData);

    const addedAccommodation = await api.accommodation.create(rawFormData);

    if (!addedAccommodation) {
      console.error("Error adding Accommodation");
      return;
    }

    redirect(`/trips/${trip.id}`);
  }

  return (
    <form action={addAccommodation} className="flex flex-col gap-3 text-black">
      <div>
        <Label htmlFor="name">Name:</Label>
        <TextInput
          name="name"
          id="name"
          placeholder={"Hotel Name, Airbnb, etc."}
          className="w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="location">Location:</Label>
        <TextInput
          name="location"
          id="location"
          placeholder={"City, State, Country"}
          className="w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="checkIn">Check-In Date:</Label>
        <input
          name="checkIn"
          type="date"
          id="checkIn"
          placeholder={"YYYY-MM-DD"}
          className="input input-bordered w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="checkOut">Check-Out Date:</Label>
        <input
          name="checkOut"
          type="date"
          id="checkOut"
          placeholder={"YYYY-MM-DD"}
          color="black"
          className="input input-bordered w-full dark:bg-white"
          style={{ colorScheme: "light" }}
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
      <div>
        <Label htmlFor="phoneNumber">Phone Number:</Label>
        <TextInput
          name="phoneNumber"
          id="phoneNumber"
          placeholder={"(123) 456-7890"}
          className="w-full dark:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="website">Website:</Label>
        <TextInput
          name="website"
          id="website"
          placeholder={"www.hotel.com"}
          className="w-full dark:bg-white"
        />
      </div>
      <Button type="submit" className="mt-4">
        Save Stay
      </Button>
    </form>
  );
};

export default AccommodationsForm;
