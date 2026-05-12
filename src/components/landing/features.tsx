import Link from "next/link"
import { QrCode, Sparkles, ShieldCheck, Clock, Award, HeadphonesIcon } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: QrCode,
      title: "QR Codes Dynamiques",
      description: "Accédez instantanément aux itinéraires mis à jour et aux galeries photos via les codes intégrés.",
    },
    {
      icon: Sparkles,
      title: "Brochure Vivante",
      description: "Un support qui ne vieillit jamais grâce à son extension numérique permanente.",
    },
    {
      icon: ShieldCheck,
      title: "Plus de Confiance",
      description: "L'aspect haut de gamme rassure vos clients sur la qualité des prestations offertes.",
    },
    {
      icon: Clock,
      title: "Gain de Temps",
      description: "Fini les recherches fastidieuses, tout l'essentiel est déjà sélectionné pour vous.",
    },
    {
      icon: Award,
      title: "Image Premium",
      description: "Positionnez-vous comme un expert du voyage d'exception auprès de votre clientèle.",
    },
    {
      icon: HeadphonesIcon,
      title: "Support Humain",
      description: "Une équipe dédiée pour vous accompagner sur chaque dossier complexe.",
    },
  ]

  return (
    <section className="bg-[#1e293b] py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-white text-center mb-16">
          CE QU&apos;ELLE VOUS APPORTE CONCRÈTEMENT
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="bg-[#263449] rounded-lg p-6 hover:bg-[#2d3d5c] transition-colors"
              >
                <IconComponent className="w-8 h-8 text-[#c4a74a] mb-4" strokeWidth={1.5} />
                <h3 className="text-white font-semibold text-base mb-3">{feature.title}</h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="#commander"
            className="inline-block bg-[#c4a74a] text-white font-medium px-8 py-4 rounded-full hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
          >
            {"Je veux en profiter !"}
          </Link>
        </div>
      </div>
    </section>
  )
}
