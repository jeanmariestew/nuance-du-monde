import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

export function Hero() {
  return (
    <section className="bg-[#f5f1eb] py-12 lg:py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1e293b] leading-[1.1] mb-1">
              CONSEILLERS EN VOYAGE,
            </h1>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1e293b] leading-[1.1] mb-1">
              VOICI LA BROCHURE QUI
            </h1>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-1">
              <span className="text-[#1e293b]">VOUS AIDE À </span>
              <span className="text-[#c4a74a]">VENDRE PLUS...</span>
            </h1>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#c4a74a] leading-[1.1] mb-8">
              ET MIEUX.
            </h1>

            <p className="text-[#475569] text-base mb-8 max-w-lg leading-relaxed">
              {"Conçue pour les professionnels du voyage, la brochure Nuance du Monde vous aide à mieux présenter vos offres, à valoriser votre expertise et à convertir davantage de demandes en réservations."}
            </p>

            {/* Checkmarks */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#1e293b]" strokeWidth={2} />
                <span className="text-[#1e293b] text-sm">Outil commercial prêt à utiliser</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#1e293b]" strokeWidth={2} />
                <span className="text-[#1e293b] text-sm">Version papier + numérique immédiate</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#1e293b]" strokeWidth={2} />
                <span className="text-[#1e293b] text-sm">100% francophone</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="#commander"
                className="bg-[#c4a74a] text-white font-medium px-8 py-4 rounded-md hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
              >
                Commander mes exemplaires
              </Link>
              <Link
                href="https://heyzine.com/flip-book/5151157645.html"
                className="bg-white text-[#1e293b] font-medium px-8 py-4 rounded-md border border-[#1e293b] hover:bg-gray-50 transition-colors text-sm uppercase tracking-wide"
              >
                Voir la version numérique
              </Link>
            </div>
          </div>

          {/* Right Content - Brochure Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop"
                alt="Brochure Nuance du Monde"
                width={500}
                height={350}
                className="rounded-lg shadow-2xl"
              />
              {/* Floating brochure images */}
              <div className="absolute -bottom-4 -right-4 w-32 h-44 bg-white rounded shadow-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&h=280&fit=crop"
                  alt="Brochure page"
                  width={128}
                  height={176}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-28 h-40 bg-white rounded shadow-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&h=280&fit=crop"
                  alt="Brochure page"
                  width={112}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
