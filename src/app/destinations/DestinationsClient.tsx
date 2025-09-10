"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des destinations...</p>
        </div>
      </div>
    );
  }

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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-12 text-yellow-600 font-[Alro]">
            TOUTES LES DESTINATIONS
          </h2>

          {destinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Aucune destination disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {destinations.map((destination) => (
                <Link
                  key={destination.id}
                  href={`/destinations/${destination.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      {destination.banner_image_url ? (
                        <Image
                          src={destination.banner_image_url}
                          alt={destination.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">
                            Pas d&apos;image
                          </span>
                        </div>
                      )}
                      <h2 className="absolute z-20 bottom-4 text-2xl font-[Alro] text-center w-full text-white">
                        {destination.title}
                      </h2>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
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
