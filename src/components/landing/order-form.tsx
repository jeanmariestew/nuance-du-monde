"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function OrderForm() {
  const [formData, setFormData] = useState({
    nomComplet: "",
    agence: "",
    courrielPro: "",
    telephone: "",
    numeroPermis: "",
    nombreExemplaires: "5 exemplaires",
    message: "",
    autoriseStockage: false,
    autorisePromo: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  return (
    <section id="commander" className="bg-[#1e293b] py-20 px-6 lg:px-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#263449] rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-2xl md:text-3xl text-white text-center mb-2 leading-[1.1]">
            JE COMMANDE MES BROCHURES
          </h2>
          <h2 className="font-display text-2xl md:text-3xl text-white text-center mb-4 leading-[1.1]">
            GRATUITEMENT
          </h2>
          <p className="text-[#94a3b8] text-center text-sm mb-8">
            Réservé aux conseillers en voyage, agences et professionnels du tourisme.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-xs uppercase tracking-wider mb-2">
                  Nom complet*
                </label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  className="w-full bg-[#1e293b] border border-[#475569] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-[#c4a74a]"
                  value={formData.nomComplet}
                  onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white text-xs uppercase tracking-wider mb-2">
                  Agence*
                </label>
                <input
                  type="text"
                  placeholder="Nom de votre enseigne"
                  className="w-full bg-[#1e293b] border border-[#475569] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-[#c4a74a]"
                  value={formData.agence}
                  onChange={(e) => setFormData({ ...formData, agence: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-xs uppercase tracking-wider mb-2">
                  Courriel pro*
                </label>
                <input
                  type="email"
                  placeholder="contact@agence.com"
                  className="w-full bg-[#1e293b] border border-[#475569] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-[#c4a74a]"
                  value={formData.courrielPro}
                  onChange={(e) => setFormData({ ...formData, courrielPro: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white text-xs uppercase tracking-wider mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  placeholder="514 000-0000"
                  className="w-full bg-[#1e293b] border border-[#475569] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-[#c4a74a]"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-xs uppercase tracking-wider mb-2">
                  Numéro de permis*
                </label>
                <input
                  type="text"
                  placeholder="012345"
                  className="w-full bg-[#1e293b] border border-[#475569] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-[#c4a74a]"
                  value={formData.numeroPermis}
                  onChange={(e) => setFormData({ ...formData, numeroPermis: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-white text-xs uppercase tracking-wider mb-2">
                  {"Nombre d'exemplaires*"}
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#1e293b] border border-[#475569] rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#c4a74a]"
                    value={formData.nombreExemplaires}
                    onChange={(e) => setFormData({ ...formData, nombreExemplaires: e.target.value })}
                  >
                    <option>5 exemplaires</option>
                    <option>10 exemplaires</option>
                    <option>20 exemplaires</option>
                    <option>50 exemplaires</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b] pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white text-xs uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                placeholder="Vos besoins spécifiques..."
                rows={4}
                className="w-full bg-[#1e293b] border border-[#475569] rounded-lg px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:border-[#c4a74a] resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-[#475569] bg-[#1e293b] text-[#c4a74a] focus:ring-[#c4a74a]"
                  checked={formData.autoriseStockage}
                  onChange={(e) => setFormData({ ...formData, autoriseStockage: e.target.checked })}
                />
                <span className="text-[#94a3b8] text-sm">
                  {"J'autorise Nuance du Monde à recueillir et stocker mes informations personnelles."}
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-[#475569] bg-[#1e293b] text-[#c4a74a] focus:ring-[#c4a74a]"
                  checked={formData.autorisePromo}
                  onChange={(e) => setFormData({ ...formData, autorisePromo: e.target.checked })}
                />
                <span className="text-[#94a3b8] text-sm">
                  {"J'autorise Nuance du Monde à m'envoyer des courriels promotionnels."}
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#c4a74a] text-white font-medium py-4 rounded-lg hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
            >
              Recevoir mes brochures
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
