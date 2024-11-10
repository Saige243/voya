"use client";
import { icons } from "lucide-react";

export const Icon = ({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: string;
}) => {
  const LucideIcon = icons[name as keyof typeof icons];
  if (!LucideIcon) {
    throw new Error(`Icon not found: ${name}`);
  }

  return <LucideIcon color={color} size={size} />;
};
