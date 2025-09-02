"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/_components/ui/button";
import { Calendar } from "~/_components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/_components/ui/popover";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  name?: string;
  disabled?: boolean;
};

export function DatePicker({ value, onChange, disabled }: DatePickerProps) {
  if (disabled) {
    return (
      <div className="flex w-full items-center rounded-md border bg-muted/20 px-3 py-2 text-left text-sm text-muted-foreground">
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        {value ? format(value, "PPP") : <span>No date selected</span>}
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
