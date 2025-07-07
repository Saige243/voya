import { api } from "~/trpc/server";

export default async function getAllSortedTrips() {
  const trips = await api.trip.getAll();
  const sortedTrips = trips.sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
  return sortedTrips;
}
