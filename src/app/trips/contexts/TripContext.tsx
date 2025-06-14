"use client";

import { createContext, useContext } from "react";
import type { Trip } from "@prisma/client";

const TripContext = createContext<Trip | null>(null);

export const TripProvider = ({
  trip,
  children,
}: {
  trip: Trip;
  children: React.ReactNode;
}) => {
  return <TripContext.Provider value={trip}>{children}</TripContext.Provider>;
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used wihin a Trip Provider");
  }
  return { trip: context };
};
