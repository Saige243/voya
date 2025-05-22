"use client";

import { useState } from "react";
import AddAccommodationsForm from "./AddAccommodationsForm";
import { type Trip } from "@prisma/client";
import { Button } from "~/components/ui/button";

export default function ShowAccommodationFormButton({
  trip,
  userId,
}: {
  trip: Trip;
  userId: string;
}) {
  const [showAccommodationsForm, setShowAccommodationsForm] = useState(false);

  return (
    <div className="flex flex-col justify-center">
      {showAccommodationsForm && (
        <AddAccommodationsForm trip={trip} userId={userId} />
      )}
      {!showAccommodationsForm && (
        <Button
          onClick={() => setShowAccommodationsForm(true)}
          className="mt-4"
          type="submit"
        >
          Add Accommodation
        </Button>
      )}
    </div>
  );
}
