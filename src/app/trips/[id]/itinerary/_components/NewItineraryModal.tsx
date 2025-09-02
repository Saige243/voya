import React from "react";
import { Card, CardContent } from "~/_components/ui/card";
import ItineraryForm from "./ItineraryForm";
import { type Trip } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/_components/ui/button";

interface ModalProps {
  tripId: number;
  date: Date;
}

function NewItineraryModal({ tripId, date }: ModalProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Add Item for Today</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Item for Today</DialogTitle>
          <DialogDescription>
            Please fill out the form below to add a new itinerary item.
          </DialogDescription>
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
