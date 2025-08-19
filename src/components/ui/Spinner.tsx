"use client";
import React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number; // px
  stroke?: number; // px
}

export default function Spinner({ size = 20, stroke = 2, className, ...rest }: SpinnerProps) {
  const style: React.CSSProperties = { width: size, height: size };
  const border = `${stroke}px`;
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={"inline-block align-middle" + (className ? ` ${className}` : "")}
      {...rest}
    >
      <span className="sr-only">Chargement…</span>
      <div
        style={style}
        className="rounded-full border-neutral-200 border-solid animate-spin"
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderTopWidth: border,
            borderRightWidth: border,
            borderBottomWidth: border,
            borderLeftWidth: border,
            borderTopColor: "var(--color-primary)",
            borderRightColor: "transparent",
            borderBottomColor: "transparent",
            borderLeftColor: "transparent",
            borderStyle: "solid",
            borderRadius: "9999px",
          }}
        />
      </div>
    </div>
  );
}
