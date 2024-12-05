"use client";
import { icons } from "lucide-react";

export const Icon = ({
  name,
  color,
  size,
  className,
}: {
  name: string;
  color?: string;
  size: string;
  className?: string;
}) => {
  const LucideIcon = icons[name as keyof typeof icons];
  if (!LucideIcon) {
    throw new Error(`Icon not found: ${name}`);
  }

  return <LucideIcon color={color} size={size} className={className} />;
};
