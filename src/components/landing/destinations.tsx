import Image from "next/image"
import Link from "next/link"

export function Destinations() {
  const destinations = [
    {
      name: "ÉGYPTE",
      image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400&h=300&fit=crop",
    },
    {
      name: "JAPON",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
    },
    {
      name: "KENYA",
      image: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=400&h=300&fit=crop",
    },
    {
      name: "MAROC",
      image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400&h=300&fit=crop",
    },
    {
      name: "PORTUGAL",
      image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop",
    },
    {
      name: "ITALIE",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop",
    },
    {
      name: "VIETNAM",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop",
    },
    {
      name: "ARGENTINE",
      image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=400&h=300&fit=crop",
    },
  ]

  return (
    <section id="destinations" className="bg-white py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-[#1e293b] text-center mb-12">
          DES DESTINATIONS QUI FONT RÊVER ET QUI SE VENDENT
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="relative h-48 md:h-56 rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-white font-semibold text-sm tracking-wide">
                  {destination.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="#destinations"
            className="inline-block bg-[#c4a74a] text-white font-medium px-8 py-4 rounded-full hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
          >
            Voir toutes les destinations
          </Link>
        </div>
      </div>
    </section>
  )
}
