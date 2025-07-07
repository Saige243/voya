"use client";

import { createContext, useContext, useState } from "react";
import type { Trip } from "@prisma/client";

type TripContextType = {
  trip: Trip | null;
  setTrip: (trip: Trip) => void;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [trip, setTrip] = useState<Trip | null>(null);

  return (
    <TripContext.Provider value={{ trip, setTrip }}>
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
