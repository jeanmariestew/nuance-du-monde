"use client"

import { useState } from "react"
import { ExternalLink, Copy, QrCode } from "lucide-react"

export function HowToReceive() {
  const [activeTab, setActiveTab] = useState<"papier" | "digitale">("digitale")

  return (
    <section className="bg-[#faf8f5] py-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-[#1e293b] text-center mb-12">
          {"COMMENT RECEVOIR VOTRE BROCHURE ?"}
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("papier")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "papier"
                ? "bg-white text-[#1e293b] border border-[#1e293b]"
                : "text-[#64748b] hover:text-[#1e293b]"
            }`}
          >
            Version papier
          </button>
          <button
            onClick={() => setActiveTab("digitale")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === "digitale"
                ? "bg-white text-[#1e293b] border border-[#1e293b]"
                : "text-[#64748b] hover:text-[#1e293b]"
            }`}
          >
            Version digitale
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-[#e2e8f0]">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Direct Access */}
            <div className="text-center">
              <h3 className="text-[#1e293b] font-semibold text-base mb-4">Accès direct</h3>
              <p className="text-[#64748b] text-sm mb-4 leading-relaxed">
                {"Cliquez simplement sur le lien \"Voir la brochure digitale\" pour accéder à la visionneuse de la brochure."}
              </p>
              <a
                href="https://heyzine.com/flip-book/5151157645.html"
                className="text-[#c4a74a] text-sm font-medium inline-flex items-center gap-1 hover:underline"
              >
                Voir la brochure digitale
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <h3 className="text-[#1e293b] font-semibold text-base mb-4">Accès via QR Code</h3>
              <p className="text-[#64748b] text-sm mb-4 leading-relaxed">
                {"Scannez le QR Code ci-après pour accéder à la visionneuse à l'aide de votre téléphone mobile."}
              </p>
              <div className="inline-flex p-4 border-4 border-[#c4a74a] rounded-lg">
                <div className="w-32 h-32 bg-white flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-[#1e293b]" />
                </div>
              </div>
            </div>

            {/* Hyperlink */}
            <div className="text-center">
              <h3 className="text-[#1e293b] font-semibold text-base mb-4">Accès par lien hypertexte</h3>
              <p className="text-[#64748b] text-sm mb-4 leading-relaxed">
                {"Copiez le lien ci-après et collez-le dans un nouvel onglet de votre navigateur. Ou partagez-le par courriel."}
              </p>
              <div className="inline-flex items-center gap-2 bg-[#f5f1eb] border border-[#e2e8f0] rounded-lg px-4 py-2">
                <span className="text-[#1e293b] text-sm">https://heyzine.com/flip-book/5151157645.html</span>
                <button className="text-[#64748b] hover:text-[#1e293b]">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
