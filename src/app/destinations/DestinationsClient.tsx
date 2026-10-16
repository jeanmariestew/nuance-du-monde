"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import DestinationsGrid from "@/components/DestinationsGrid";
import OffersGrid from "@/components/OffersGrid";
import { useDestinationsByContinent } from "@/hooks/useDestinationsByContinent";
import { api } from "@/lib/axios";

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

const DESTINATIONS_LIST_ID = "toutes-les-destinations";

function continentHref(continent: string) {
  return `/destinations?continent=${encodeURIComponent(continent)}#${DESTINATIONS_LIST_ID}`;
}

function scrollToDestinationsList() {
  document.getElementById(DESTINATIONS_LIST_ID)?.scrollIntoView({ behavior: "smooth" });
}

export default function DestinationsClient() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("continent");
  });
  const [loading, setLoading] = useState(true);
  const { destinations: destinationsByContinent, fetchDestinations: fetchContinents } = useDestinationsByContinent();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.get("/destinations?active=true");
        const data = response.data;

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
    fetchContinents();
    
    // Récupérer le continent depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const continentParam = urlParams.get('continent');
    if (continentParam) {
      setSelectedContinent(continentParam);
    }
  }, [fetchContinents]);

  // Filtrer les destinations selon le continent sélectionné
  useEffect(() => {
    if (selectedContinent) {
      const filtered = destinations.filter(dest => dest.continent === selectedContinent);
      setFilteredDestinations(filtered);
    } else {
      setFilteredDestinations(destinations);
    }
  }, [selectedContinent, destinations]);


  // Images et couleurs pour chaque continent
  const continentImagesMap: Record<string, { image: string; overlay: string }> = {
    'Afrique': { image: '/images/afrique.jpg', overlay: 'bg-black/50' },
    'Amérique du Nord': { image: '/images/amerique-du-nord.jpg', overlay: 'bg-black/50' },
    'Amérique du Sud': { image: '/images/amerique-du-sud.jpg', overlay: 'bg-black/50' },
    'Asie': { image: '/images/asie.jpg', overlay: 'bg-black/50' },
    'Europe': { image: '/images/europe.jpg', overlay: 'bg-black/50' },
    'Océanie': { image: '/images/oceanie.jpg', overlay: 'bg-black/50' },
    'Moyen-Orient': { image: '/images/moyen-orient.jpg', overlay: 'bg-black/50' },
    'Antarctique': { image: '/images/antarctique.jpg', overlay: 'bg-black/50' },
  };
  
  const getContinentStyle = (continent: string) => {
    return continentImagesMap[continent] || { image: '', overlay: 'bg-gray-600/40' };
  };

  const continents = destinationsByContinent ? Object.keys(destinationsByContinent).sort() : [];

  return (
    <div>
      {/* Hero Section avec rectangles de continents */}
      <section className="relative min-h-screen w-full mb-20 md:mb-0">
        {/* Titre et texte flottants en haut au centre */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-center z-20 pointer-events-none pt-8 sm:pt-20 md:pt-24">
          <div className="text-center px-4">
            <h1 className="text-2xl md:text-5xl font-bold md:mb-6 md:text-white text-black drop-shadow-2xl font-[Alro] uppercase">
              NOS DESTINATIONS
            </h1>
            <p className="text-lg  md:text-3xl md:hidden text-black md:text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              Voyagez au cœur des plus belles destinations du monde à travers des
              itinéraires captivants et soigneusement conçus pour vous.
            </p>
          </div>
        </div>

        {/* Rectangles de continents en une seule ligne */}
        <div className="absolute inset-0 hidden md:flex gap-0">
          {continents.map((continent) => {
            const destinationCount = destinationsByContinent?.[continent]?.length || 0;
            const isSelected = selectedContinent === continent;
            const continentStyle = getContinentStyle(continent);
            return (
              <div
                key={continent}
                className={`group relative flex-1 overflow-hidden hover:flex-[1.2] transition-all duration-500 ease-in-out ${
                  isSelected ? 'flex-[1.3] ring-4 ring-white/50' : ''
                }`}
              >
                <Link
                  href={continentHref(continent)}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedContinent(continent);
                    window.history.pushState({}, '', continentHref(continent));
                    scrollToDestinationsList();
                  }}
                  className="absolute inset-0 overflow-hidden"
                >
                  {/* Image de fond */}
                  {continentStyle.image ? (
                    <OptimizedImage 
                      src={continentStyle.image} 
                      alt={continent}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 20vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-600"></div>
                  )}
                  
                  {/* Overlay coloré transparent */}
                  <div className={`absolute inset-0 ${continentStyle.overlay} group-hover:bg-black/40 transition-colors duration-300`}></div>
                  
                  {/* Dégradé pour la lisibilité */}
                  <div className="absolute inset-0 from-black/70 via-black/20 to-black/30"></div>
                  
                  {/* Contenu centré */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
                    <h3 className="text-xl h-10 font-bold text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 text-center drop-shadow-2xl">
                      {continent}
                    </h3>
                    <p className="text-white/90 text-base sm:text-lg lg:text-xl font-medium text-center drop-shadow-lg">
                      {destinationCount} {destinationCount > 1 ? 'destinations' : 'destination'}
                    </p>
                    <span className="mt-4 inline-flex items-center rounded-full bg-[#d9a900] px-4 py-2 text-sm font-semibold text-white shadow">
                      Découvrir
                    </span>
                  </div>
                  
                  {/* Effet hover */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Mobile: Grille de cartes */}
        <div className="absolute inset-0 md:hidden h-auto px-4 pt-48 pb-8">
          <div className="grid grid-cols-2 gap-3">
            {continents.map((continent) => {
              const destinationCount = destinationsByContinent?.[continent]?.length || 0;
              const isSelected = selectedContinent === continent;
              const continentStyle = getContinentStyle(continent);

              return (
                <Link
                  key={continent}
                  href={continentHref(continent)}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedContinent(continent);
                    window.history.pushState({}, '', continentHref(continent));
                    scrollToDestinationsList();
                  }}
                  className={`group relative h-40 rounded-xl overflow-hidden ${
                    isSelected ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  {/* Image de fond */}
                  {continentStyle.image ? (
                    <OptimizedImage
                      src={continentStyle.image}
                      alt={continent}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-600"></div>
                  )}

                  {/* Overlay */}
                  <div className={`absolute inset-0 ${continentStyle.overlay}`}></div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>

                  {/* Contenu */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-3">
                    <h3 className="text-sm font-bold text-white text-center drop-shadow-lg font-[Alro] leading-tight">
                      {continent}
                    </h3>
                    <p className="text-white/80 text-xs mt-1">
                      {destinationCount} {destinationCount > 1 ? 'dest.' : 'dest.'}
                    </p>
                    <span className="mt-2 inline-flex items-center rounded-full bg-[#d9a900] px-3 py-1 text-xs font-semibold text-white">
                      Découvrir
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <div id={DESTINATIONS_LIST_ID} className="scroll-mt-24">
        {selectedContinent && (
          <div className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Destinations en {selectedContinent}
              </h2>
              <button
                onClick={() => {
                  setSelectedContinent(null);
                  window.history.pushState({}, '', '/destinations');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Voir toutes nos destinations
              </button>
            </div>
          </div>
        )}
        <DestinationsGrid
          destinations={filteredDestinations}
          loading={loading}
          compact
        />
      </div>
      <section>
        <OffersGrid
          continent={selectedContinent || undefined}
          compact
          itemsPerPage={10}
          title={selectedContinent ? `Offres en ${selectedContinent}` : "Offres pour cette destination"}
          emptyMessage={selectedContinent ? `Aucune offre pour ${selectedContinent}.` : "Aucune offre pour cette destination."}
        />
      </section>
    </div>
  );
}
