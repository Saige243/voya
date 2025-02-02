import React from "react";

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`input input-bordered w-full ${className}`}
      {...props}
    />
  );
});

TextInput.displayName = "TextInput";
