"use client";

import { adminLabelClass, adminSelectClass } from "@/components/admin/adminFormStyles";

type Option = {
  value: string;
  label: string;
};

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  placeholder?: string;
}

export default function AdminSelect({
  label,
  options,
  placeholder,
  className,
  id,
  ...props
}: AdminSelectProps) {
  const selectId = id || props.name || undefined;

  return (
    <label className={label ? adminLabelClass : "block"}>
      {label}
      <span className="relative mt-1 block">
        <select
          id={selectId}
          className={`${adminSelectClass} ${label ? "" : "mt-0"} ${className || ""}`}
          {...props}
        >
          {placeholder !== undefined && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
    </label>
  );
}
