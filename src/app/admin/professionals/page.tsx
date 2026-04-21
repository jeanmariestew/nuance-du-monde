"use client";

import { useState, useEffect } from "react";

interface Professional {
  id: number;
  email: string;
  agency_name: string;
  certificate_number: string;
  status: "pending" | "validated" | "rejected";
  phone?: string;
  created_at: string;
}

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
      if (data.success) {
        setProfessionals(data.data);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [filter]);

  const updateStatus = async (id: number, status: "validated" | "rejected") => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/professionals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProfessionals();
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setUpdating(null);
    }
  };

  const deleteProfessional = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce professionnel ?")) return;
    
    try {
      const res = await fetch(`/api/admin/professionals/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchProfessionals();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case "validated":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Validé</span>;
      case "rejected":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejeté</span>;
      default:
        return null;
    }
  };

  const pendingCount = professionals.filter(p => p.status === "pending").length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Professionnels</h1>
          <p className="text-gray-600 mt-1">
            Gérez les demandes d&apos;accès des agences de voyage
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
            {pendingCount} demande{pendingCount > 1 ? "s" : ""} en attente
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "all", label: "Tous" },
          { value: "pending", label: "En attente" },
          { value: "validated", label: "Validés" },
          { value: "rejected", label: "Rejetés" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f.value
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      ) : professionals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Aucun professionnel trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Permis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {professionals.map((pro) => (
                <tr key={pro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{pro.agency_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {pro.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {pro.certificate_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {pro.phone || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(pro.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(pro.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {pro.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(pro.id, "validated")}
                          disabled={updating === pro.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          {updating === pro.id ? "..." : "Valider"}
                        </button>
                        <button
                          onClick={() => updateStatus(pro.id, "rejected")}
                          disabled={updating === pro.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                    {pro.status === "validated" && (
                      <button
                        onClick={() => updateStatus(pro.id, "rejected")}
                        disabled={updating === pro.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Révoquer
                      </button>
                    )}
                    {pro.status === "rejected" && (
                      <button
                        onClick={() => updateStatus(pro.id, "validated")}
                        disabled={updating === pro.id}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                      >
                        Réactiver
                      </button>
                    )}
                    <button
                      onClick={() => deleteProfessional(pro.id)}
                      className="text-gray-400 hover:text-red-600 ml-2"
                    >
                      Supprimer
                    </button>
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
