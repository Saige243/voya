import DailyItinerary from "~/components/itineraries/DailyItinerary";

export default async function ItineraryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div className="w-full">
        <DailyItinerary />
      </div>
    </main>
  );
}
