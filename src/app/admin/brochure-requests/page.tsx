"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/axios";
import AdminShell from "@/components/admin/AdminShell";

interface BrochureRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  agency_name?: string;
  phone?: string;
  address?: string;
  quantity: number;
  status: "pending" | "sent" | "cancelled";
  notes?: string;
  created_at: string;
  sent_at?: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  sent:      { label: "Envoyée",    color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulée",   color: "bg-red-100 text-red-800" },
};

export default function BrochureRequestsPage() {
  const [requests, setRequests] = useState<BrochureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/brochure-requests" : `/brochure-requests?status=${filter}`;
      const res = await adminApi.get(url);
      if (res.data.success) setRequests(res.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await adminApi.put(`/brochure-requests/${id}`, { status });
      await load();
    } catch {}
    setUpdating(null);
  };

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-semibold">Demandes de brochures</h1>
        <div className="flex items-center gap-2">
          {["all", "pending", "sent", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === s ? "bg-black text-white" : "border border-gray-200 hover:border-gray-400"
              }`}
            >
              {s === "all" ? "Toutes" : STATUS_LABELS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm py-8">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
          Chargement...
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Aucune demande trouvée.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Nom", "Email", "Agence", "Qté", "Adresse", "Statut", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-4 py-3 text-blue-600">
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.agency_name || "—"}</td>
                  <td className="px-4 py-3 text-center">{r.quantity}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate" title={r.address}>
                    {r.address || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${STATUS_LABELS[r.status]?.color}`}>
                      {STATUS_LABELS[r.status]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString("fr-CA")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {r.status === "pending" && (
                        <button
                          onClick={() => updateStatus(r.id, "sent")}
                          disabled={updating === r.id}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          Marquer envoyée
                        </button>
                      )}
                      {r.status !== "cancelled" && (
                        <button
                          onClick={() => updateStatus(r.id, "cancelled")}
                          disabled={updating === r.id}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
