import Image from "next/image"
import Link from "next/link"
import { Users, User, Calendar, Ship, Compass } from "lucide-react"

export function TravelTypes() {
  const travelTypes = [
    {
      icon: Users,
      title: "VOYAGES EN GROUPES",
      description: "Proposez nos circuits accompagnés francophones et départs regroupés.",
      image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=300&h=200&fit=crop",
    },
    {
      icon: User,
      title: "VOYAGES INDIVIDUELS SUR MESURE",
      description: "Créez des projets personnalisés pour couples, familles ou voyageurs exigeants.",
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=300&h=200&fit=crop",
    },
    {
      icon: Calendar,
      title: "VOYAGEURS REGROUPÉS À DATES FIXES",
      description: "Vendez des dates programmées sans devoir créer votre propre groupe.",
      image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=300&h=200&fit=crop",
    },
    {
      icon: Ship,
      title: "PRÉ/POST CROISIÈRES & ESCALES",
      description: "Augmentez le panier moyen avec des extensions intelligentes.",
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=300&h=200&fit=crop",
    },
    {
      icon: Compass,
      title: "VOYAGES THÉMATIQUES",
      description: "Golf, culture, bien-être, découvertes ciblées, événements spéciaux.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    },
  ]

  return (
    <section className="bg-white py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-[#1e293b] mb-4">
            TOUT CE QUE VOUS POUVEZ PROPOSER AVEC CETTE BROCHURE
          </h2>
          <p className="text-[#64748b] text-base">
            Une seule brochure. Plusieurs sources de ventes.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {travelTypes.map((type, index) => {
            const IconComponent = type.icon
            return (
              <div key={index} className="group">
                <div className="relative h-40 rounded-t-lg overflow-hidden">
                  <Image
                    src={type.image}
                    alt={type.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-[#f5f1eb] p-4 rounded-b-lg">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-[#c4a74a]">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#1e293b] font-semibold text-xs uppercase mb-2 leading-tight">
                    {type.title}
                  </h3>
                  <p className="text-[#64748b] text-xs leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="#commander"
            className="inline-block bg-[#c4a74a] text-white font-medium px-8 py-4 rounded-full hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
          >
            Commander mes brochures
          </Link>
        </div>
      </div>
    </section>
  )
}
