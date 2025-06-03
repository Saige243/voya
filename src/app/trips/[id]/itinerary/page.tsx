import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";

export default async function ItineraryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome to <span className="text-[hsl(280,100%,70%)]">Itinerary</span>
          .
        </h1>
      </div>
    </main>
  );
}
