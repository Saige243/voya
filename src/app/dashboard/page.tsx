import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
import TripShowcase from "~/app/trips/_components/TripShowcase";
import { travelPhrases } from "~/constants/travel-phrases";

export default async function Dashboard() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  console.log("Session:", session);

  const firstName = session?.user?.name?.split(" ")[0];

  const randomTravelPhrase =
    travelPhrases[Math.floor(Math.random() * travelPhrases.length)];

  return (
    <main className="flex min-h-screen flex-col place-items-center  p-6 text-white">
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
