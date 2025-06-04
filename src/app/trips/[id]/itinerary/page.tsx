import DailyItinerary from "~/components/itineraries/DailyItinerary";

export default async function ItineraryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <DailyItinerary />
      </div>
    </main>
  );
}
