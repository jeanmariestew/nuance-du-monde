"use client";

import AdminCheckbox from "@/components/admin/AdminCheckbox";

interface AdminToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

/** Case à cocher mise en avant (statut / visibilité). */
export default function AdminToggle(props: AdminToggleProps) {
  return <AdminCheckbox {...props} variant="card" />;
}
