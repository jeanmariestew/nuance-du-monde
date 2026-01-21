"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { parseItinerary, extractLocations, getDestinationLocations } from "@/lib/itineraryParser";
import ItineraryTimeline from "./ItineraryTimeline";

// Import dynamique de la carte pour éviter les problèmes SSR avec Leaflet
const ItineraryMap = dynamic(() => import("./ItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface OfferItinerarySectionProps {
  description?: string;
  destinations?: Array<{ id: number; title: string; slug: string }>;
  title?: string;
  programmeLink?: string;
}

export default function OfferItinerarySection({
  description,
  destinations,
  title = "Itinéraire détaillé",
  programmeLink,
}: OfferItinerarySectionProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parse l'itinéraire depuis la description (memoized pour éviter re-parsing)
  const itinerary = useMemo(() => {
    return description ? parseItinerary(description) : [];
  }, [description]);

  useEffect(() => {
    async function loadLocations() {
      setIsLoading(true);
      
      // Extrait les localisations depuis l'itinéraire
      let locs = await extractLocations(itinerary);
      
      // Si pas de localisations trouvées dans l'itinéraire, utilise les destinations
      if (locs.length === 0 && destinations) {
        locs = await getDestinationLocations(destinations);
      }
      
      setLocations(locs);
      setIsLoading(false);
    }

    loadLocations();
  }, [itinerary, destinations]);

  // Si pas d'itinéraire ni de localisations, ne rien afficher
  if (itinerary.length === 0 && locations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="site-section">
      <div className="site-container">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-xs sm:text-sm font-bold text-yellow-700 uppercase tracking-wider">
              Programme du voyage
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-gray-900 mb-4 sm:mb-6 px-4">
            {title}
          </h2>
          {programmeLink && (
            <div className="flex items-center justify-center gap-4 px-4">
              {(() => {
                const isPdf = programmeLink.toLowerCase().endsWith('.pdf');
                return (
                  <a
                    href={programmeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...(isPdf ? { download: '' } : {})}
                    className="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
                    title={isPdf ? 'Télécharger le programme (PDF)' : 'Ouvrir le programme'}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">{isPdf ? 'Télécharger le programme' : 'Ouvrir le programme'}</span>
                    <span className="sm:hidden">{isPdf ? 'Télécharger' : 'Ouvrir'}</span>
                  </a>
                );
              })()}
            </div>
          )}
        </div>

        {/* Map and Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Left: Map */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-20 sm:top-24 h-[400px] sm:h-[500px] lg:h-[700px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white">
              {locations.length > 0 ? (
                <ItineraryMap locations={locations} title={destinations?.[0]?.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500 text-sm sm:text-base">Carte non disponible</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="order-1 lg:order-2">
            <div className="h-[400px] sm:h-[500px] lg:h-[700px] shadow-xl">
              {itinerary.length > 0 ? (
                <ItineraryTimeline itinerary={itinerary} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-base sm:text-lg">Itinéraire non disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
