"use client";

import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import { DestinationCardSkeleton } from "@/components/ui/SkeletonLoader";

interface Destination {
  id: number;
  title: string;
  slug: string;
  continent?: string;
  short_description?: string;
  banner_image_url?: string;
  price_from?: number;
  price_currency?: string;
  duration_days?: number;
  duration_nights?: number;
}

interface DestinationsGridProps {
  destinations: Destination[];
  loading?: boolean;
  title?: string;
  emptyMessage?: string;
  compact?: boolean;
}

export default function DestinationsGrid({
  destinations,
  loading = false,
  title = "TOUTES LES DESTINATIONS",
  emptyMessage = "Aucune destination disponible pour le moment.",
  compact = false,
}: DestinationsGridProps) {
  const sectionClass = compact ? "pt-4 pb-2" : "py-16";
  const titleClass = compact ? "mb-4" : "mb-12";

  if (loading) {
    return (
      <section className={sectionClass}>
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl text-center font-bold text-yellow-600 font-[Alro] uppercase ${titleClass}`}>
            {title}
          </h2>
          <DestinationCardSkeleton count={8} />
        </div>
      </section>
    );
  }

  return (
    <section className={sectionClass}>
      <div className="container mx-auto px-4">
        <h2 className={`text-2xl text-center font-bold text-yellow-600 font-[Alro] uppercase ${titleClass}`}>
          {title}
        </h2>

        {destinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {emptyMessage}
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
                      <OptimizedImage
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
                    {destination.continent && (
                      <div className="absolute top-2 left-2 z-20">
                        <span className="bg-yellow-600/90 text-white text-sm px-3 py-1.5 rounded-full font-medium">
                          {destination.continent}
                        </span>
                      </div>
                    )}
                    <h2 className="absolute z-20 bottom-4 text-2xl font-[Alro] uppercase text-center w-full text-white">
                      {destination.title}
                    </h2>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
