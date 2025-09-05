import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { Icon } from "~/_components/common/Icon";

interface ConfirmationModalProps {
  buttonText: string;
  text: string;
  confirmation: string;
  icon?: string;
  iconColor?: string;
  onConfirm: () => void;
}

function ConfirmationModal({
  buttonText,
  text,
  confirmation,
  icon,
  iconColor = "black",
  onConfirm,
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("");

  const isMatch =
    inputValue.trim().toLowerCase() === confirmation.toLowerCase();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-start text-${iconColor}`}
        >
          {icon && <Icon name={icon} size="20" />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{text}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type "${confirmation}" to confirm`}
          />
          <Button variant="destructive" disabled={!isMatch} onClick={onConfirm}>
            {confirmation}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationModal;
