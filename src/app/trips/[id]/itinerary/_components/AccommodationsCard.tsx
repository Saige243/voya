import React, { useState } from "react";
import CardMenu from "~/_components/common/CardMenu";
import { Card, CardContent } from "~/_components/ui/card";
import { DeleteAccommodationButton } from "../../add-accommodation/_components/DeleteAccommodationButton";
import { type Accommodation } from "@prisma/client";
import { Button } from "~/_components/ui/button";
import { Icon } from "~/_components/common/Icon";
import AccommodationsForm from "./../../../_components/AccommodationsForm";
import AccommodationsView from "~/app/trips/_components/AccommodationsView";

type FormData = {
  name: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  notes?: string;
  phoneNumber?: string;
  website?: string;
};

function AccommodationsCard({
  accommodation,
}: {
  accommodation: Accommodation;
  tripId: number;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const editButton = (
    <div className="mt-2 flex justify-end">
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
        <DeleteAccommodationButton accId={accommodation.id} />
      </CardMenu>
    </div>
  );

  return (
    <Card>
      <CardContent>
        {isEditing ? (
          <AccommodationsForm
            accommodation={accommodation}
            onSuccessfulSubmit={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <AccommodationsView accommodation={accommodation} />
        )}
        {!isEditing && editButton}
      </CardContent>
    </Card>
  );
}

export default AccommodationsCard;
