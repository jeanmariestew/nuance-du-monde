import Link from "next/link"

export function Stats() {
  const stats = [
    { value: "+ de 25 ans", label: "d'expertise terrain" },
    { value: "+ de 600", label: "itinéraires disponibles" },
    { value: "+ de 40", label: "destinations couvertes" },
    { value: "100%", label: "contenu francophone" },
  ]

  return (
    <section className="bg-white py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-[#64748b] text-xs tracking-[0.2em] uppercase mb-12">
          Déjà utilisée par des conseillers et agences partout au Québec
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-[#1e293b] text-3xl md:text-4xl font-light mb-2">{stat.value}</p>
              <p className="text-[#64748b] text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <Link
          href="#commander"
          className="inline-block bg-[#c4a74a] text-white font-medium px-8 py-4 rounded-full hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
        >
          Commander mes brochures
        </Link>
      </div>
    </section>
  )
}
