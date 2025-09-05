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
  onConfirm: () => Promise<void>; // async now
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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMatch =
    inputValue.trim().toLowerCase() === confirmation.toLowerCase();

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      await onConfirm();
      setOpen(false);
      setInputValue("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <div className="flex flex-col items-center justify-center space-y-5">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type "${confirmation}" to confirm`}
            disabled={loading}
          />
          <Button
            variant="destructive"
            disabled={!isMatch || loading}
            onClick={handleConfirm}
          >
            {icon && <Icon name={icon} size="20" />}
            {loading ? "Processing..." : confirmation}
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationModal;
