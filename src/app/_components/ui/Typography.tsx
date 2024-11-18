import React from "react";
import classNames from "classnames";

type TypographyProps = {
  as?: keyof JSX.IntrinsicElements;
  variant?: "heading1" | "heading2" | "body" | "label" | "caption";
  className?: string;
  children: React.ReactNode;
};

const variantStyles = {
  heading1: "text-2xl font-bold dark:text-white",
  heading2: "text-xl font-bold dark:text-white",
  body: "text-gray-500 dark:text-white",
  label: "text-sm font-semibold dark:text-gray-400",
  caption: "text-xs text-gray-500",
};

export const Typography: React.FC<TypographyProps> = ({
  as: Component = "p",
  variant = "body",
  className,
  children,
}) => {
  return (
    <Component className={classNames(variantStyles[variant], className)}>
      {children}
    </Component>
  );
};
