"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import AdminCheckbox from "@/components/admin/AdminCheckbox";
import { adminInputClass } from "@/components/admin/adminFormStyles";

export type AdminMultiSelectItem = {
  id: number;
  title: string;
};

interface AdminMultiSelectGridProps {
  items: AdminMultiSelectItem[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  searchPlaceholder?: string;
  emptyLabel?: string;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function AdminMultiSelectGrid({
  items,
  selectedIds,
  onChange,
  searchPlaceholder = "Rechercher…",
  emptyLabel = "Aucun résultat",
}: AdminMultiSelectGridProps) {
  const [query, setQuery] = useState("");

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) =>
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
      ),
    [items]
  );

  const filteredItems = useMemo(() => {
    const q = normalize(query);
    if (!q) return sortedItems;
    return sortedItems.filter((item) => normalize(item.title).includes(q));
  }, [sortedItems, query]);

  const selectedCount = selectedIds.length;

  const toggleId = (id: number, checked: boolean) => {
    if (checked) {
      if (selectedIds.includes(id)) return;
      onChange([...selectedIds, id]);
      return;
    }
    onChange(selectedIds.filter((value) => value !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className={`${adminInputClass} mt-0 pl-9`}
          />
        </div>
        <p className="shrink-0 text-xs text-neutral-500 sm:text-right">
          {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
          {query ? ` · ${filteredItems.length} résultat${filteredItems.length > 1 ? "s" : ""}` : ""}
        </p>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50/50 p-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <AdminCheckbox
              key={item.id}
              checked={selectedIds.includes(item.id)}
              onChange={(checked) => toggleId(item.id, checked)}
              label={item.title}
              variant="card"
            />
          ))}
        </div>
      )}
    </div>
  );
}
