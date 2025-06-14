import "~/styles/globals.css";
import { TripProvider } from "../contexts/TripContext";
import getTrip from "~/app/trips/actions/getTrip";

export default async function TripLayout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  console.log("params:", params);
  console.log("params type:", typeof params.id);
  const trip = await getTrip(params.id);

  return (
    <>
      {/* {children} */}
      <TripProvider trip={trip}>{children}</TripProvider>
    </>
  );
}
