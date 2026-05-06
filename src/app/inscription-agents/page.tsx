"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, AlertCircle, CheckCircle, Loader } from "lucide-react";

export default function InscriptionAgentsPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    certificate_number: "",
    email: "",
    agency_name: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    status?: string;
    opc_verified?: boolean;
  } | null>(null);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/professionals/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: data.data.message,
          status: data.data.status,
          opc_verified: data.data.opc_verified,
        });
        setFormData({
          first_name: "",
          last_name: "",
          certificate_number: "",
          email: "",
          agency_name: "",
          phone: "",
        });
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FFFF00] rounded-full flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-[Alro] uppercase text-[#FFFF00]">
                Inscription espace agents
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Créez votre accès professionnel Nuance du Monde
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-1 bg-[#FFFF00]" />

      {/* Formulaire personnalisé */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8">
          {!result ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Erreurs */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>{error}</div>
                  </div>
                )}

                {/* Prénom et Nom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                    placeholder="jean@agence.com"
                  />
                </div>

                {/* Numéro de permis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de permis OPC *
                  </label>
                  <input
                    type="text"
                    name="certificate_number"
                    value={formData.certificate_number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                    placeholder="OPC-XXXX-XXXXX"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Vous pouvez le vérifier sur{" "}
                    <a
                      href="https://pes.opc.gouv.qc.ca/certificat/recherche/?lang=fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black font-medium hover:underline"
                    >
                      le site de l'OPC
                    </a>
                  </p>
                </div>

                {/* Agence et Téléphone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l&apos;agence
                    </label>
                    <input
                      type="text"
                      name="agency_name"
                      value={formData.agency_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                      placeholder="Mon Agence de Voyages"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                      placeholder="+1 514 ..."
                    />
                  </div>
                </div>

                {/* Message pendant vérification */}
                {isSubmitting && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex gap-3">
                    <Loader className="w-5 h-5 shrink-0 mt-0.5 animate-spin" />
                    <div>
                      <p className="font-medium">Vérification en cours...</p>
                      <p className="text-sm mt-1">Ne fermer pas cette page pendant la vérification de votre permis OPC.</p>
                    </div>
                  </div>
                )}

                {/* Bouton Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-[#FFFF00] font-bold py-3 rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Vérification en cours..." : "S'inscrire et vérifier"}
                </button>
              </form>

              {/* Lien connexion */}
              <div className="mt-8 text-center text-gray-500 text-sm">
                <p>
                  Vous avez déjà un compte ?{" "}
                  <Link href="/espace-pro" className="font-semibold text-black hover:underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            </>
          ) : (
            /* Résultat */
            <div className="text-center space-y-6">
              {result.success && result.opc_verified ? (
                <>
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-2 font-[Alro]">
                      Vérification réussie!
                    </h2>
                    <p className="text-gray-600 mb-6">{result.message}</p>
                    <Link
                      href="/espace-pro"
                      className="inline-flex items-center gap-2 bg-black text-[#FFFF00] font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-all"
                    >
                      Accéder à l&apos;espace agents
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-2 font-[Alro]">
                      Inscription en attente
                    </h2>
                    <p className="text-gray-600 mb-6">{result.message}</p>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">
                        Un email de confirmation vous a été envoyé.
                      </p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-black text-[#FFFF00] font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-all"
                      >
                        Retour à l&apos;accueil
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
