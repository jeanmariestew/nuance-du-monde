import Link from "next/link"

export function Testimonials() {
  const testimonials = [
    {
      quote: "Un outil indispensable pour mes rendez-vous. La qualité du papier et des visuels rassure immédiatement mes clients sur le sérieux de nos séjours.",
      name: "Julie R.",
      role: "Conseillère Export, Voyages Fontainebleau",
      initials: "JR",
      featured: true,
    },
    {
      quote: "Excellent outil pour présenter rapidement plusieurs options.",
      name: "Nathalie M.",
      role: "Directrice d'agence",
      initials: "NM",
      featured: false,
    },
    {
      quote: "Très utile pour vendre groupes et croisières.",
      name: "Marc D.",
      role: "Spécialiste FIT & Sur-mesure",
      initials: "MD",
      featured: false,
    },
  ]

  return (
    <section id="conseillers" className="bg-[#faf8f5] py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-[#1e293b] text-center mb-12">
          CE QUE DISENT LES CONSEILLERS EN VOYAGE
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative rounded-xl p-6 ${
                testimonial.featured ? "bg-[#c4a74a] text-white" : "bg-white border border-[#e2e8f0]"
              }`}
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-4">
                <span
                  className={`text-5xl font-serif leading-none ${
                    testimonial.featured ? "text-white/30" : "text-[#c4a74a]/30"
                  }`}
                >
                  &quot;
                </span>
              </div>

              <p
                className={`text-sm leading-relaxed mb-6 italic ${
                  testimonial.featured ? "text-white" : "text-[#475569]"
                }`}
              >
                &quot;{testimonial.quote}&quot;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    testimonial.featured
                      ? "bg-white text-[#c4a74a]"
                      : "bg-[#1e293b] text-white"
                  }`}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p
                    className={`font-semibold text-sm ${
                      testimonial.featured ? "text-white" : "text-[#1e293b]"
                    }`}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className={`text-xs ${
                      testimonial.featured ? "text-white/80" : "text-[#64748b]"
                    }`}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="#commander"
            className="inline-block bg-[#c4a74a] text-white font-medium px-8 py-4 rounded-full hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
          >
            Recevoir mes exemplaires
          </Link>
        </div>
      </div>
    </section>
  )
}
