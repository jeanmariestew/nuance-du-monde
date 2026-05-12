import Image from "next/image"
import Link from "next/link"
import { Check, Clock } from "lucide-react"

export function BrochureBenefits() {
  const benefits = [
    "Idéale en rendez-vous client",
    "Parfaite pour relance après soumission",
    "Support tangible qui marque les esprits",
    "Facilite la recommandation premium",
    "Accès enrichi via QR codes",
  ]

  return (
    <section className="bg-white py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-[#1e293b] mb-2 leading-[1.1]">
              UNE BROCHURE PENSÉE POUR
            </h2>
            <h2 className="font-display text-3xl md:text-4xl text-[#1e293b] mb-6 leading-[1.1]">
              VOUS FAIRE GAGNER DU TEMPS
            </h2>

            <p className="text-[#64748b] text-base mb-8 max-w-lg leading-relaxed">
              {"Plus qu'un catalogue, c'est un outil commercial conçu pour présenter rapidement les bonnes options et aider vos clients à passer à l'action."}
            </p>

            {/* Checkmarks */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#c4a74a] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[#1e293b] text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <Link
              href="#commander"
              className="inline-block bg-[#c4a74a] text-white font-medium px-8 py-4 rounded-md hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
            >
              Recevoir mes exemplaires
            </Link>
          </div>

          {/* Right Content - Image with Badge */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&h=400&fit=crop"
                alt="Brochure ouverte"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            
            {/* Time Savings Badge */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#c4a74a] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#c4a74a]" />
              </div>
              <div>
                <p className="text-[#64748b] text-xs uppercase tracking-wider">Gain de temps</p>
                <p className="text-[#1e293b] font-bold text-sm">{"-40% temps d'explication"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
