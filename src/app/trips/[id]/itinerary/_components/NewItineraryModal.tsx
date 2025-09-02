import React from "react";
import { Card, CardContent } from "~/_components/ui/card";
import ItineraryForm from "./ItineraryForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { format } from "date-fns";

interface ModalProps {
  tripId: number;
  date: Date;
}

function NewItineraryModal({ tripId, date }: ModalProps) {
  const formattedDate = format(date, "MMMM d");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Item for {formattedDate}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Itinerary Item for {formattedDate}</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent>
            <ItineraryForm tripId={tripId} date={date} />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default NewItineraryModal;
