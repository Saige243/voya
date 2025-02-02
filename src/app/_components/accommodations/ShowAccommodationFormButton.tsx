"use client";

import { useState } from "react";
import AddAccommodationsForm from "./AddAccommodationsForm";
import { type Trip } from "@prisma/client";

export default function ShowAccommodationFormButton({
  trip,
  userId,
}: {
  trip: Trip;
  userId: string;
}) {
  const [showAccommodationsForm, setShowAccommodationsForm] = useState(false);

  return (
    <div>
      {showAccommodationsForm && (
        <AddAccommodationsForm trip={trip} userId={userId} />
      )}
      <button
        onClick={() => setShowAccommodationsForm(true)}
        className="btn btn-primary"
      >
        Add Accommodation
      </button>
    </div>
  );
}
