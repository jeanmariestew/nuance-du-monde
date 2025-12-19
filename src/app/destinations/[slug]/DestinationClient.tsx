import Image from "next/image"
import type { Destination, Offer } from "@/types"
import OffersGrid from "@/components/OffersGrid"
import DestinationsGrid from "@/components/DestinationsGrid"

interface DestinationClientProps {
  destination: Destination
  slug: string
  offers: Offer[]
  otherDestinations: Destination[]
}

export default function DestinationClient({
  destination,
  slug,
  otherDestinations,
}: DestinationClientProps) {
  const coverImage = destination.banner_image_url || destination.image_url || ""

  const titleOther = `AUTRES DESTINATIONS${
    destination?.continent?.trim() ? ` EN ${destination.continent.toUpperCase()}` : ""
  }`

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center md:items-end overflow-hidden">
        <div className="absolute inset-0">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={destination.title}
              fill
              className="object-cover z-10"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full from-blue-600 to-purple-600" />
          )}

          <div className="absolute inset-0 bg-black/50 z-20" />
          <div className="absolute inset-0 from-black/20 to-black/95 z-20" />
        </div>

        <div className="relative z-30 w-full text-center md:text-left mb-0 md:mb-40 text-white px-6 sm:px-8 md:px-12">
          <div className="max-w-xl mx-auto md:mx-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl uppercase font-bold font-[Alro] mb-4 md:mb-6">
              {destination.short_description || destination.title}
            </h1>

            {destination.description && (
              <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                {destination.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Offers for this Destination */}
      {/* Si tu veux utiliser ton OffersGrid qui fetch tout seul */}
      <OffersGrid
        destination={slug}
        title="Offres pour cette destination"
        emptyMessage="Aucune offre pour cette destination."
      />

      {/* OU si tu veux utiliser offers déjà fetchés (à toi de voir) */}
      {/* <OffersGrid initialOffers={offers} ... />  si ton composant le supporte */}

      {/* Other destinations */}
      <DestinationsGrid
        destinations={otherDestinations}
        loading={false}
        title={titleOther}
      />
    </div>
  )
}
