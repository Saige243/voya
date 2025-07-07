"use client";

import { createContext, useContext, useState } from "react";
import type { Trip } from "@prisma/client";

type TripContextType = {
  trip: Trip | null;
  setTrip: (trip: Trip) => void;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({
  trip,
  children,
}: {
  trip: Trip | null;
  children: React.ReactNode;
}) => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(trip);

  return (
    <TripContext.Provider
      value={{ trip: currentTrip, setTrip: setCurrentTrip }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};
