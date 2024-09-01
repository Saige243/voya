import React from "react";

export function Label({
  htmlFor,
  children,
  className,
}: {
  htmlFor: string;
  children: string;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`dark:text-white ${className}`}>
      {children}
    </label>
  );
}
