import { type ItineraryItem } from "@prisma/client";
import { Icon } from "~/_components/common/Icon";
import React from "react";
import { Button } from "~/_components/ui/button";
import CardMenu from "~/_components/common/CardMenu";
import { Typography } from "~/_components/common/Typography";
import ConfirmationModal from "~/app/trips/_components/ConfirmationModal";
import { format, set } from "date-fns";
import NewItineraryModal from "./NewItineraryModal";
import { api } from "~/trpc/react";

type ItineraryFormValues = {
  title: string;
  date: Date;
  time: string;
  location: string;
  notes: string;
  isMeal: boolean;
  mealType?: string;
  link: string;
};

function ItineraryView({
  item,
  tripId,
  onEditClick,
  onDeleteClick,
}: {
  item: ItineraryItem;
  tripId: number;
  onEditClick: (item: ItineraryItem) => void;
  onDeleteClick: (id: number) => Promise<void>;
}) {
  const utils = api.useUtils();
  const formatTime = (timeDate: Date | null) =>
    !timeDate ? "All day" : format(timeDate, "h:mm a");
  const isGoogleMapsLink = item.link?.includes("google.com/maps");

  const createItineraryItem = api.itineraryItem.create.useMutation({
    onSuccess: async () => {
      await utils.itineraryItem.getAll.invalidate({ tripId });
    },
    onError: (err) => {
      console.error("Error creating itinerary item:", err);
    },
  });

  const handleCreateItem = (data: ItineraryFormValues) => {
    const [hours, minutes] = data.time.split(":").map(Number);

    const combined = set(data.date, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    });

    createItineraryItem.mutate({
      tripId,
      title: data.title,
      date: data.date,
      time: combined,
      location: data.location,
      notes: data.notes,
      isMeal: data.isMeal,
      mealType: data.mealType,
      link: data.link,
    });
  };

  return (
    <>
      <div
        key={item.id}
        className="mb-4 ml-8 flex items-center justify-between border-b pb-2"
      >
        <div className="pr-2">
          <Typography className="text-base font-medium underline">
            {item.title}
          </Typography>
          <div className="flex flex-row items-center">
            <Icon
              name="Clock"
              className="pr-2 text-black dark:text-white"
              size="24"
            />
            <Typography className="text-sm text-gray-600">
              {formatTime(item.time)}
            </Typography>
          </div>
          <div className="flex flex-row items-center">
            <Icon
              name="MapPin"
              className="pr-2 text-black dark:text-white"
              size="24"
            />
            <Typography className="text-sm text-gray-600">
              {item.location}
            </Typography>
          </div>
          {item.notes && (
            <div className="flex flex-row items-center">
              <Icon
                name="MessageCircleMore"
                className="pr-2 text-black dark:text-white"
                size="24"
              />
              <Typography className="text-sm text-gray-600">
                {item.notes}
              </Typography>
            </div>
          )}
          {item.link && (
            <div className="mb-2 flex flex-row items-center">
              <Icon
                name="Link"
                className="pr-2 text-black dark:text-white"
                size="24"
              />
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <Typography className="text-sm text-gray-600">
                  {isGoogleMapsLink ? "📍 Google Maps Link" : item.link}
                </Typography>
              </a>
            </div>
          )}
          {item.isMeal && (
            <div className="flex w-fit flex-row items-center rounded-lg bg-green-400 pr-2">
              {item.mealType === "coffee" ? (
                <Icon
                  name="Coffee"
                  className="pl-2 text-white dark:text-white"
                  size="24"
                />
              ) : (
                <Icon
                  name="Utensils"
                  className="pl-2 text-white dark:text-white"
                  size="24"
                />
              )}
              <Typography className="pl-2 text-sm font-bold text-white">
                {item.mealType?.toUpperCase()}
              </Typography>
            </div>
          )}
        </div>
        <div>
          <CardMenu>
            <>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onEditClick(item)}
              >
                <Icon
                  name="Pencil"
                  className="text-black dark:text-white"
                  size="20"
                />
                Edit
              </Button>
              <ConfirmationModal
                buttonText="Delete"
                icon="Trash"
                iconColor="red-500"
                text="Are you sure you want to delete this item?"
                confirmation="Delete"
                showInput={false}
                onConfirm={() => onDeleteClick(item.id)}
              />
            </>
          </CardMenu>
        </div>
      </div>
      {/* <div className="flex w-full justify-center">
        <NewItineraryModal
          date={item.time ?? new Date()}
          onConfirm={handleCreateItem}
        />
      </div> */}
    </>
  );
}

export default ItineraryView;
