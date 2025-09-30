import React from "react";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { Textarea } from "~/_components/ui/textarea";
import { Label } from "~/_components/ui/label";
import { Checkbox } from "~/_components/ui/checkbox";
import { DatePicker } from "~/_components/ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";
import { type ItineraryItem } from "@prisma/client";
import { format, set } from "date-fns";
import { MEAL_OPTIONS } from "./constants";

interface EditItineraryFormProps {
  editFormData: Partial<ItineraryItem>;
  onFormDataChange: (data: Partial<ItineraryItem>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function EditItineraryForm({
  editFormData,
  onFormDataChange,
  onSubmit,
  onCancel,
}: EditItineraryFormProps) {
  const handleTimeChange = (timeValue: string) => {
    const newTime = timeValue
      ? set(new Date(), {
          hours: parseInt(timeValue.split(":")[0] ?? "0"),
          minutes: parseInt(timeValue.split(":")[1] ?? "0"),
          seconds: 0,
          milliseconds: 0,
        })
      : null;
    onFormDataChange({ ...editFormData, time: newTime });
  };

  return (
    <form onSubmit={onSubmit} className="mb-4 border-b pb-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            name="title"
            value={editFormData.title ?? ""}
            onChange={(e) =>
              onFormDataChange({ ...editFormData, title: e.target.value })
            }
            placeholder="Title"
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <DatePicker disabled value={editFormData.time ?? undefined} />
        </div>

        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            value={
              editFormData.time
                ? format(new Date(editFormData.time), "HH:mm")
                : ""
            }
            onChange={(e) => handleTimeChange(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            name="location"
            value={editFormData.location ?? ""}
            onChange={(e) =>
              onFormDataChange({ ...editFormData, location: e.target.value })
            }
            placeholder="Location"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="isMeal"
            checked={editFormData.isMeal ?? false}
            onCheckedChange={(checked) =>
              onFormDataChange({
                ...editFormData,
                isMeal: checked === true,
                mealType: checked ? (editFormData.mealType ?? "") : null,
              })
            }
          />
          <Label htmlFor="isMeal">Meal?</Label>
        </div>

        {editFormData.isMeal && (
          <div>
            <Label htmlFor="mealType">Meal Type</Label>
            <Select
              onValueChange={(value) =>
                onFormDataChange({ ...editFormData, mealType: value })
              }
              value={editFormData.mealType ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a meal" />
              </SelectTrigger>
              <SelectContent>
                {MEAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="link">Link</Label>
          <Input
            name="link"
            value={editFormData.link ?? ""}
            onChange={(e) =>
              onFormDataChange({ ...editFormData, link: e.target.value })
            }
            placeholder="Link"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            name="notes"
            value={editFormData.notes ?? ""}
            onChange={(e) =>
              onFormDataChange({ ...editFormData, notes: e.target.value })
            }
            placeholder="Notes"
          />
        </div>

        <div className="flex justify-center gap-2">
          <Button type="submit">Save</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
