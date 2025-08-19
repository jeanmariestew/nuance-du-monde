import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "muted";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const styles: Record<BadgeVariant, string> = {
  default: "bg-neutral-900 text-white",
  success: "bg-green-600 text-white",
  warning: "bg-yellow-500 text-neutral-900",
  danger: "bg-red-600 text-white",
  muted: "bg-neutral-100 text-neutral-700",
};

export default function Badge({ variant = "default", className, ...rest }: BadgeProps) {
  return (
    <span
      className={(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " +
        styles[variant] +
        (className ? ` ${className}` : "")
      ).trim()}
      {...rest}
    />
  );
}
