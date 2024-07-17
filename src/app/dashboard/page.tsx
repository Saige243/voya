import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Button } from "../_components/Button";
import { travelPhrases } from "~/constants/travel-phrases";

export default async function Dashboard() {
  // const hello = await api.post.hello({ text: ", time to travel" });
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const firstName = session?.user?.name?.split(" ")[0];

  const randomTravelPhrase =
    travelPhrases[Math.floor(Math.random() * travelPhrases.length)];

  return (
    <main className="flex min-h-screen flex-col place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-6 text-white">
      <h3 className="text-xl font-extrabold tracking-tight sm:text-[3rem]">
        {randomTravelPhrase}
        {", "}
        <span className="text-[hsl(280,100%,70%)]">{firstName}</span>.
      </h3>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <TripShowcase />
      </div>
    </main>
  );
}

async function TripShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const trips = await api.trip.getAll();

  return (
    <div className="w-full max-w-xs">
      {trips.length ? (
        <p className="truncate">Your most recent trip: {trips[0]?.title}</p>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p>You have no trips yet!</p>
          <a href="/trips/new">
            <Button>Create a trip</Button>
          </a>
        </div>
      )}
    </div>
  );
}
