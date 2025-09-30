import React from "react";
import { format } from "date-fns";
import { Button } from "~/_components/ui/button";
import { Icon } from "~/_components/common/Icon";
import { Typography } from "~/_components/common/Typography";
import CardMenu from "~/_components/common/CardMenu";
import ConfirmationModal from "../../../_components/ConfirmationModal";
import { type ItineraryItem } from "@prisma/client";

interface ItineraryItemDisplayProps {
  item: ItineraryItem;
  onEditClick: (item: ItineraryItem) => void;
  onDeleteClick: (id: number) => void;
}

const isGoogleMapsLink = (link: string) => link?.includes("google.com/maps");

const formatTime = (timeDate: Date | null) =>
  !timeDate ? "All day" : format(timeDate, "h:mm a");

const getItemIcon = (item: ItineraryItem) => {
  if (item.isMeal && item.mealType === "coffee") {
    return { name: "Coffee" as const, size: "24" as const };
  } else if (item.isMeal) {
    return { name: "Utensils" as const, size: "24" as const };
  } else {
    return { name: "Text" as const, size: "24" as const };
  }
};

const getItemIconColor = (item: ItineraryItem) => {
  return item.isMeal ? "bg-green-500" : "bg-gray-400 dark:bg-gray-700";
};

export function ItineraryItemDisplay({
  item,
  onEditClick,
  onDeleteClick,
}: ItineraryItemDisplayProps) {
  const itemIcon = getItemIcon(item);
  const iconColor = getItemIconColor(item);

  return (
    <div className="mb-4 ml-8 flex flex-row border-b pb-2">
      <div
        className={`mr-2 flex h-fit flex-row rounded-full py-1 pr-2 ${iconColor}`}
      >
        <Icon
          name={itemIcon.name}
          className="pl-2 text-white"
          size={itemIcon.size}
        />
      </div>

      <div className="w-full pr-2">
        <Typography className="flex flex-row items-center gap-1 text-base font-medium">
          {item.title}
          {item.isMeal && (
            <Typography className="rounded-full border border-green-500 px-2 text-sm font-bold text-green-500 decoration-2">
              {item.mealType?.toUpperCase()}
            </Typography>
          )}
        </Typography>

        <div className="flex flex-row justify-between">
          <div>
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
                name="Map"
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
                  className="shrink-0 pr-2 text-black dark:text-white"
                  size="24"
                />
                <Typography className="text-sm text-gray-600">
                  {item.notes}
                </Typography>
              </div>
            )}

            {item.link && (
              <div className="mb-3 flex flex-row items-center">
                <Icon
                  name={isGoogleMapsLink(item.link) ? "MapPin" : "Link"}
                  className="pr-2 text-black dark:text-white"
                  size="24"
                />
                <Typography className="text-sm text-gray-600">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-5 underline hover:text-blue-600"
                  >
                    {isGoogleMapsLink(item.link)
                      ? "Google Maps Link"
                      : item.title}
                  </a>
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
                  Edit Item
                </Button>
                <ConfirmationModal
                  buttonText="Delete"
                  icon="Trash"
                  iconColor="red-500"
                  text="Are you sure you want to delete this item?"
                  confirmation="Delete Item"
                  showInput={false}
                  onConfirm={async () => onDeleteClick(item.id)}
                />
              </>
            </CardMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
