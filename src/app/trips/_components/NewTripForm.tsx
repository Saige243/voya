import { Button } from "~/app/_components/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

const NewTripForm = ({ userId }: { userId: string }) => {
  async function createTrip(formData: FormData) {
    "use server";

    const rawFormData = {
      title: formData.get("title"),
      description: formData.get("description"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    };
    return console.log("form data:", rawFormData);
  }

  return (
    <form action={createTrip} className="text-black">
      <div>
        <label htmlFor="title">Title:</label>
        <input
          name="title"
          type="text"
          id="title"
          defaultValue="title"
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          name="description"
          id="description"
          defaultValue="description"
          required
        />
      </div>
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input
          name="startDate"
          type="date"
          id="startDate"
          defaultValue="startDate"
          required
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <input
          name="endDate"
          type="date"
          id="endDate"
          defaultValue="endDate"
          required
        />
      </div>
      <Button type="submit">Create Trip</Button>
    </form>
  );
};

export default NewTripForm;
