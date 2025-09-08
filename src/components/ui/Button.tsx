"use client";
import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none text-black border-black border-1 justify-center align-center flex";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[--color-primary] hover:brightness-110 focus-visible:ring-[--color-primary]",
  secondary:
    "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900",
  ghost:
    "bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-300",
  danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-600",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-2",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-3",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {iconLeft && <span className="inline-flex">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="inline-flex">{iconRight}</span>}
    </button>
  );
}

export default Button;
