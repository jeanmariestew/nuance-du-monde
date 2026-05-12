import Link from "next/link"

export function CTA() {
  return (
    <section className="bg-[#1e293b] py-20 px-6 lg:px-12 relative overflow-hidden">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#263449] to-[#1e293b] opacity-50" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-2 leading-[1.1]">
          VOUS CONSEILLEZ. NOUS VOUS DONNONS
        </h2>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-8 leading-[1.1]">
          LES OUTILS POUR VENDRE DAVANTAGE.
        </h2>

        <p className="text-[#94a3b8] text-base mb-10 max-w-2xl mx-auto leading-relaxed">
          {"Recevez la brochure Nuance du Monde et exploitez plus d'opportunités commerciales dès maintenant."}
        </p>

        <Link
          href="#commander"
          className="inline-block bg-[#c4a74a] text-white font-medium px-8 py-4 rounded-full hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
        >
          Commander la brochure
        </Link>
      </div>
    </section>
  )
}
