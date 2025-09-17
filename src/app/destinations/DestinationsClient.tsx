"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DestinationsGrid from "@/components/DestinationsGrid";
import OffersGrid from "@/components/OffersGrid";

interface Destination {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  banner_image_url?: string;
  price_from?: number;
  price_currency?: string;
  duration_days?: number;
  duration_nights?: number;
}

export default function DestinationsClient() {
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
      <section className="relative h-screen flex flex-col items-start justify-end">
        <div className="absolute inset-0">
          <Image
            src="/images/destination_fond.png"
            alt="Les destinations"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 bg-opacity-50"></div>
        </div>
        {/* Floating decorative image */}
        <div className="absolute top-8 right-8 w-20 h-20 opacity-70 z-5">
          <Image
            src="/images/footer_bg.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60"></div>

        <div className="relative z-10 text-white max-w-2xl p-6 pb-20">
          <h1 className="text-3xl font-bold mb-4 font-[Alro]">
            LES DESTINATIONS
          </h1>
          <p className="text-sm">
            Voyagez au cœur des plus belles destinations du monde à travers des
            itinéraires captivants et soigneusement conçus pour vous.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <DestinationsGrid 
        destinations={destinations}
        loading={loading}
      />
      <section>
        <OffersGrid
          itemsPerPage={10}
          title="Offres pour cette destination"
          emptyMessage="Aucune offre pour cette destination."
        />
      </section>
    </div>
  );
}
