"use client";

import Image from "next/image";
import Link from "next/link";
import { Destination, Offer } from "@/types";
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
        const response = await fetch("/api/destinations?active=true");
        const data = await response.json();

        if (data.success) {
          setDestinations(data.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-end">
        <div className="absolute inset-0">
          {destination.banner_image_url ? (
            <Image
              src={destination.banner_image_url || ""}
              alt={destination.title}
              fill
              className="object-cover z-10"
            />
          ) : destination.image_url ? (
            <Image
              src={destination.image_url}
              alt={destination.title}
              fill
              className="object-cover z-10"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-30 text-left mb-40 text-white max-w-xl px-4">
          <h1 className="text-3xl uppercase font-bold font-[Alro] mb-4">
            {destination.short_description}
          </h1>
          {destination.description && (
            <p className="text-sm">{destination.description}</p>
          )}
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
        title="AUTRES DESTINATIONS"
      />
    </div>
  );
}
