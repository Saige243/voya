"use client";

import { type Trip } from "@prisma/client";
import React, { useState } from "react";
import CardMenu from "~/_components/common/CardMenu";
import { Icon } from "~/_components/common/Icon";
import { Button } from "~/_components/ui/button";
import { Card, CardContent } from "~/_components/ui/card";
import { DeleteTripButton } from "~/app/trips/_components/DeleteTripButton";
import TripDetailsView from "./TripDetailsView";
import TripDetailsForm from "./TripDetailsForm";

function TripDetailsCard({ trip }: { trip: Trip }) {
  const [isEditing, setIsEditing] = useState(false);

  const editTripDetailsMenu = (
    <div className="mt-8 flex justify-end">
      <CardMenu>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setIsEditing(true)}
        >
          <Icon
            name="Pencil"
            className="text-black dark:text-white"
            size="20"
          />
          Edit Details
        </Button>
        <DeleteTripButton id={trip.id} />
      </CardMenu>
    </div>
  );

  return (
    <Card className="w-full rounded-lg border bg-white text-black shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <CardContent>
        {isEditing ? (
          <TripDetailsForm
            trip={trip}
            onCancel={() => setIsEditing(false)}
            onSubmitSuccess={() => setIsEditing(false)}
          />
        ) : (
          <TripDetailsView trip={trip} />
        )}
        {!isEditing && editTripDetailsMenu}
      </CardContent>
    </Card>
  );
}

export default TripDetailsCard;
