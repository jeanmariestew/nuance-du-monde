
import Image from "next/image";
import { Destination } from "@/types";
import OffersGrid from "@/components/OffersGrid";
import DestinationsGrid from "@/components/DestinationsGrid";
import { useEffect, useState } from "react";

interface DestinationClientProps {
  destination: Destination;
  slug: string;
}

export default function DestinationClient({ destination, slug }: DestinationClientProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://nuancedumonde.com";

        const response = await fetch(`${baseUrl}/api/destinations?active=true`);
        const data = await response.json();

        if (data.success) {
          // Filtrer pour afficher uniquement les destinations du même continent
          const sameContinent = data.data.filter(
            (dest: Destination) => 
              dest.continent === destination.continent && 
              dest.id !== destination.id // Exclure la destination actuelle
          );
          setDestinations(sameContinent);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [destination.continent, destination.id]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center md:items-end">
        <div className="absolute inset-0">
          {destination.banner_image_url ? (
            <Image
              src={destination.banner_image_url || ""}
              alt={destination.title}
              fill
              className="object-cover z-10"
              priority
            />
          ) : destination.image_url ? (
            <Image
              src={destination.image_url}
              alt={destination.title}
              fill
              className="object-cover z-10"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-30 w-full text-center md:text-left mb-0 md:mb-40 text-white px-6 sm:px-8 md:px-12">
          <div className="max-w-xl mx-auto md:mx-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl uppercase font-bold font-[Alro] uppercase mb-4 md:mb-6">
              {destination.short_description}
            </h1>
            {destination.description && (
              <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                {destination.description}
              </p>
            )}
          </div>
        </div>
        <div className="absolute z-20 inset-0 bg-gradient-to-b from-black/20 to-black/95"></div>
      </section>

      {/* Offers for this Destination */}
      <OffersGrid
        destination={slug}
        title="Offres pour cette destination"
        emptyMessage="Aucune offre pour cette destination."
      />

      <DestinationsGrid 
        destinations={destinations} 
        loading={loading}
        title={`AUTRES DESTINATIONS ${destination.continent ? `EN ${destination.continent.toUpperCase()}` : ''}`}
      />
    </div>
  );
}
