"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { parseItineraryWithIntro, extractLocations, getDestinationLocations } from "@/lib/itineraryParser";
import ItineraryTimeline from "./ItineraryTimeline";
import OptimizedImage from "./OptimizedImage";
import type { ItineraryMapRef } from "./ItineraryMap";

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

export interface DayOption {
  id?: number;
  day_number: number;
  title: string;
  description?: string;
  image_url?: string;
  price_supplement?: number;
  price_currency?: string;
  is_included?: boolean;
}

interface OfferItinerarySectionProps {
  description?: string;
  destinations?: Array<{ id: number; title: string; slug: string }>;
  title?: string;
  programmeLink?: string;
  // Coordonnées manuelles (prioritaires sur l'extraction automatique)
  coordinates?: Array<{ name: string; lat: number; lng: number }>;
  // Centre personnalisé de la carte
  mapCenter?: { lat: number; lng: number; zoom: number } | null;
  // Image statique de la carte (remplace la carte dynamique)
  mapImage?: string;
  // Options d'activités par jour
  dayOptions?: DayOption[];
}

export default function OfferItinerarySection({
  description,
  destinations,
  title = "Itinéraire détaillé",
  programmeLink,
  coordinates,
  mapCenter,
  mapImage,
  dayOptions,
}: OfferItinerarySectionProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<ItineraryMapRef>(null);

  // Callback quand on clique sur un jour dans la timeline
  const handleDayClick = useCallback((dayIndex: number) => {
    mapRef.current?.zoomToDay(dayIndex);
  }, []);

  // Parse l'itinéraire depuis la description (memoized pour éviter re-parsing)
  const { introduction, days: itinerary } = useMemo(() => {
    return description ? parseItineraryWithIntro(description) : { days: [] };
  }, [description]);

  // Chargement des localisations pour la carte dynamique
  useEffect(() => {
    async function loadLocations() {
      setIsLoading(true);
      
      // 1. Priorité aux coordonnées manuelles si fournies
      if (coordinates && coordinates.length > 0) {
        setLocations(coordinates);
        setIsLoading(false);
        return;
      }
      
      // 2. Sinon, extrait les localisations depuis l'itinéraire
      let locs = await extractLocations(itinerary);
      
      // 3. Si pas de localisations trouvées dans l'itinéraire, utilise les destinations
      if (locs.length === 0 && destinations) {
        locs = await getDestinationLocations(destinations);
      }
      
      setLocations(locs);
      setIsLoading(false);
    }

    loadLocations();
  }, [itinerary, destinations, coordinates]);

  // Si pas d'itinéraire, ne rien afficher
  if (itinerary.length === 0) {
    return null;
  }

  return (
    <section className="site-section">
      <div className="site-container">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2  px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-xs sm:text-sm font-bold text-yellow-700 uppercase tracking-wider">
              Programme du voyage
            </span>
          </div>
          <h2 className="text-xl font-[Alro] sm:text-2xl lg:text-5xl uppercase font-medium text-gray-900 mb-4 sm:mb-6 px-4">
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
                    className="bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
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
              
              {/* Carte dynamique Leaflet ou image statique */}
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de la carte...</p>
                  </div>
                </div>
              ) : locations.length > 0 ? (
                <ItineraryMap ref={mapRef} locations={locations} title={destinations?.[0]?.title} mapCenter={mapCenter} />
              ) : mapImage ? (
                <OptimizedImage
                  src={mapImage}
                  alt={`Carte de l'itinéraire - ${destinations?.[0]?.title || title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
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
                <ItineraryTimeline itinerary={itinerary} introduction={introduction} dayOptions={dayOptions} onDayClick={handleDayClick} />
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
