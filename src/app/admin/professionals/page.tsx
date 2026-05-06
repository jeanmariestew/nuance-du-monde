"use client";

import { useState, useEffect } from "react";
import { ExternalLink, ShieldCheck, ShieldX } from "lucide-react";

interface Professional {
  id: number;
  email: string;
  agency_name: string;
  first_name?: string;
  last_name?: string;
  certificate_number: string;
  status: "pending" | "validated" | "rejected";
  opc_verified?: boolean;
  phone?: string;
  created_at: string;
}

const OPC_SEARCH_URL = "https://www.opc.gouv.qc.ca/fr/trouver-un-commercant/?";

export default function AdminProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const url = filter === "all"
        ? "/api/admin/professionals"
        : `/api/admin/professionals?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setProfessionals(data.data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfessionals(); }, [filter]);

  const updateStatus = async (id: number, status: "validated" | "rejected") => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/professionals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchProfessionals();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setUpdating(null);
    }
  };

  const toggleOpc = async (id: number, current: boolean) => {
    setUpdating(id);
    try {
      await fetch(`/api/admin/professionals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opc_verified: !current }),
      });
      fetchProfessionals();
    } catch {}
    setUpdating(null);
  };

  const deleteProfessional = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce professionnel ?")) return;
    try {
      await fetch(`/api/admin/professionals/${id}`, { method: "DELETE" });
      fetchProfessionals();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const pendingCount = professionals.filter(p => p.status === "pending").length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents de voyage</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez les demandes d&apos;accès à l&apos;espace agents</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold text-sm">
            {pendingCount} demande{pendingCount > 1 ? "s" : ""} en attente
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: "all", label: "Tous" },
          { value: "pending", label: "En attente" },
          { value: "validated", label: "Validés" },
          { value: "rejected", label: "Rejetés" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === f.value
                ? "bg-black text-[#FFFF00]"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto" />
          <p className="mt-2 text-gray-600 text-sm">Chargement...</p>
        </div>
      ) : professionals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Aucun professionnel trouvé</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Conseiller", "Agence", "Email", "N° Permis", "OPC", "Statut", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {professionals.map((pro) => (
                <tr key={pro.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                    {pro.first_name} {pro.last_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{pro.agency_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href={`mailto:${pro.email}`} className="text-blue-600 hover:underline">{pro.email}</a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-700">{pro.certificate_number}</span>
                      <a
                        href={`${OPC_SEARCH_URL}q=${encodeURIComponent(pro.certificate_number)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Vérifier sur le site OPC Québec"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => toggleOpc(pro.id, !!pro.opc_verified)}
                      disabled={updating === pro.id}
                      title={pro.opc_verified ? "Marqué OPC vérifié — cliquer pour retirer" : "Marquer comme vérifié OPC"}
                      className="transition-colors disabled:opacity-50"
                    >
                      {pro.opc_verified
                        ? <ShieldCheck className="w-5 h-5 text-green-600" />
                        : <ShieldX className="w-5 h-5 text-gray-300 hover:text-yellow-500" />
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {pro.status === "pending"   && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">En attente</span>}
                    {pro.status === "validated" && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Validé</span>}
                    {pro.status === "rejected"  && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejeté</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                    {new Date(pro.created_at).toLocaleDateString("fr-CA")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {pro.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(pro.id, "validated")}
                            disabled={updating === pro.id}
                            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                          >
                            Valider
                          </button>
                          <button
                            onClick={() => updateStatus(pro.id, "rejected")}
                            disabled={updating === pro.id}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                          >
                            Rejeter
                          </button>
                        </>
                      )}
                      {pro.status === "validated" && (
                        <button
                          onClick={() => updateStatus(pro.id, "rejected")}
                          disabled={updating === pro.id}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 disabled:opacity-50"
                        >
                          Révoquer
                        </button>
                      )}
                      {pro.status === "rejected" && (
                        <button
                          onClick={() => updateStatus(pro.id, "validated")}
                          disabled={updating === pro.id}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 disabled:opacity-50"
                        >
                          Réactiver
                        </button>
                      )}
                      <button
                        onClick={() => deleteProfessional(pro.id)}
                        className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                      >
                        Suppr.
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
