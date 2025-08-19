import React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        "rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm " +
        (className || "")
      }
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={("p-5 border-b border-neutral-200 " + (className || "")).trim()} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={("text-lg font-semibold " + (className || "")).trim()} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={("p-5 " + (className || "")).trim()} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={("p-5 border-t border-neutral-200 " + (className || "")).trim()} {...props} />;
}

export default { Card, CardHeader, CardTitle, CardContent, CardFooter };
