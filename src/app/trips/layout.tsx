import "~/styles/globals.css";
import { TripProvider } from "./contexts/TripContext";
import getTrip from "~/app/trips/actions/getTrip";

export default async function TripLayout({
  params,
  children,
}: {
  params: { tripId: string };
  children: React.ReactNode;
}) {
  console.log("params:", params);
  // const trip = await getTrip(params.tripId);

  return (
    <>
      {children}
      {/* <TripProvider trip={trip}>{children}</TripProvider> */}
    </>
  );
}
