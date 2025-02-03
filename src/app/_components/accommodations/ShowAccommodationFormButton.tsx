"use client";

import { useState } from "react";
import AddAccommodationsForm from "./AddAccommodationsForm";
import { type Trip } from "@prisma/client";
import { Button } from "../common/Button";

export default function ShowAccommodationFormButton({
  trip,
  userId,
}: {
  trip: Trip;
  userId: string;
}) {
  const [showAccommodationsForm, setShowAccommodationsForm] = useState(false);

  return (
    <div className="flex justify-center">
      {showAccommodationsForm && (
        <AddAccommodationsForm trip={trip} userId={userId} />
      )}
      {!showAccommodationsForm && (
        <Button
          onClick={() => setShowAccommodationsForm(true)}
          className="mt-4"
        >
          Add Accommodation
        </Button>
      )}
    </div>
  );
}
