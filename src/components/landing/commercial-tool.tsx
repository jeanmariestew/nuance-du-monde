import Link from "next/link"
import { Check } from "lucide-react"

export function CommercialTool() {
  const benefits = [
    "Vendre plus facilement",
    "Gagner du temps",
    "Montrer votre expertise",
    "Augmenter vos revenus",
    "Rassurer vos prospects",
    "Accès immédiat au numérique",
  ]

  return (
    <section id="pourquoi" className="bg-[#1e293b] py-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl text-white mb-2 leading-[1.1]">
          UN OUTIL COMMERCIAL.
        </h2>
        <h2 className="font-display text-4xl md:text-5xl text-white mb-8 leading-[1.1]">
          PAS UN SIMPLE CATALOGUE.
        </h2>

        <p className="text-[#94a3b8] text-base mb-10 max-w-2xl mx-auto leading-relaxed">
          {"Cette brochure a été pensée pour vous aider à vendre plus efficacement, gagner du temps dans vos échanges et élargir vos opportunités de revenus. Elle vous permet de présenter rapidement une offre solide, crédible et diversifiée."}
        </p>

        {/* Benefits Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-transparent border border-white/30 rounded-full px-5 py-2.5"
            >
              <Check className="w-4 h-4 text-white" strokeWidth={2} />
              <span className="text-white text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        <Link
          href="#commander"
          className="inline-block bg-[#c4a74a] text-white font-medium px-8 py-4 rounded-full hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
        >
          Recevoir mes exemplaires
        </Link>
      </div>
    </section>
  )
}
