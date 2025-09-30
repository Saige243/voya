import React from "react";
import { format } from "date-fns";
import { Typography } from "~/_components/common/Typography";
import { Icon } from "~/_components/common/Icon";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/_components/ui/accordion";
import { type ItineraryItem } from "@prisma/client";
import { ItineraryItemDisplay } from "./ItineraryItemDisplay";
import { EditItineraryForm } from "./EditItineraryForm";
import NewItineraryModal from "./NewItineraryModal";

interface DayItineraryAccordionProps {
  date: Date;
  items: ItineraryItem[];
  editingId: number | null;
  editFormData: Partial<ItineraryItem>;
  onEditClick: (item: ItineraryItem) => void;
  onFormDataChange: (data: Partial<ItineraryItem>) => void;
  onSubmitEdit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
  onDeleteItem: (id: number) => void;
  onCreateItem: (data: {
    title: string;
    date: Date;
    time: string;
    location: string;
    notes: string;
    isMeal: boolean;
    mealType?: string;
    link: string;
  }) => void;
}

export function DayItineraryAccordion({
  date,
  items,
  editingId,
  editFormData,
  onEditClick,
  onFormDataChange,
  onSubmitEdit,
  onCancelEdit,
  onDeleteItem,
  onCreateItem,
}: DayItineraryAccordionProps) {
  const orderedItems = items.sort((a, b) => {
    if (a.time && b.time) {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    }
    return 0;
  });

  return (
    <AccordionItem key={date.toISOString()} value={date.toISOString()}>
      <AccordionTrigger>
        <div className="flex w-full items-center justify-between">
          <Typography className="flex items-center text-lg font-semibold">
            <Icon
              name="Calendar"
              className="mr-4 text-black dark:text-white"
              size="20"
            />
            {format(date, "EEEE, MMM d")}
          </Typography>
          <Typography>{items.length} Items</Typography>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        {items.length === 0 ? (
          <Typography className="mb-2 text-gray-600 dark:text-gray-400">
            No itinerary items planned for this day.
          </Typography>
        ) : (
          orderedItems.map((item) =>
            editingId === item.id ? (
              <EditItineraryForm
                key={item.id}
                editFormData={editFormData}
                onFormDataChange={onFormDataChange}
                onSubmit={onSubmitEdit}
                onCancel={onCancelEdit}
              />
            ) : (
              <ItineraryItemDisplay
                key={item.id}
                item={item}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteItem}
              />
            ),
          )
        )}

        <div className="flex w-full justify-center">
          <NewItineraryModal date={date} onConfirm={onCreateItem} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
