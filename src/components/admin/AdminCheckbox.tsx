"use client";

import { adminCheckboxInputClass } from "@/components/admin/adminFormStyles";

interface AdminCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  /** compact = pastille pour listes (types, thèmes…); card = case plus visible */
  variant?: "compact" | "card";
}

export default function AdminCheckbox({
  checked,
  onChange,
  label,
  description,
  variant = "compact",
}: AdminCheckboxProps) {
  if (variant === "card") {
    return (
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
          checked
            ? "border-neutral-900 bg-neutral-900 text-white"
            : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-neutral-300 hover:bg-white"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={`${adminCheckboxInputClass} mt-0.5`}
        />
        <span className="min-w-0">
          <span className="block text-sm font-medium leading-snug">{label}</span>
          {description && (
            <span
              className={`mt-0.5 block text-xs leading-snug ${
                checked ? "text-white/70" : "text-neutral-500"
              }`}
            >
              {description}
            </span>
          )}
        </span>
      </label>
    );
  }

  return (
    <label
      className={`inline-flex max-w-full cursor-pointer items-center gap-2.5 rounded-full border px-3 py-2 text-sm transition-colors ${
        checked
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={adminCheckboxInputClass}
      />
      <span className="truncate font-medium">{label}</span>
    </label>
  );
}
