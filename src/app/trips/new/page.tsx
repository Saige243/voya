// pages/new-trip.jsx
import { getServerAuthSession } from "~/server/auth";
import NewTripForm from "../_components/NewTripForm";

export default async function NewTrip() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <main className="flex min-h-screen flex-col place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-6 text-white">
      <NewTripForm userId={1} />
    </main>
  );
}
