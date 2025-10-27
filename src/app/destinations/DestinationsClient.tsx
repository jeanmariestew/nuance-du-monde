"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DestinationsGrid from "@/components/DestinationsGrid";
import OffersGrid from "@/components/OffersGrid";
import { useDestinationsByContinent } from "@/hooks/useDestinationsByContinent";

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

export default function DestinationsClient() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { destinations: destinationsByContinent, fetchDestinations: fetchContinents } = useDestinationsByContinent();

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


  // Couleurs spécifiques pour chaque continent
  const continentColorsMap: Record<string, { bg: string; dots: string }> = {
    'Afrique': { bg: 'from-orange-600 to-orange-700', dots: 'from-orange-400/40 to-transparent' },
    'Amérique du Nord': { bg: 'from-blue-600 to-blue-700', dots: 'from-blue-400/40 to-transparent' },
    'Amérique du Sud': { bg: 'from-lime-500 to-lime-600', dots: 'from-lime-300/40 to-transparent' },
    'Asie': { bg: 'from-red-600 to-red-700', dots: 'from-red-400/40 to-transparent' },
    'Europe': { bg: 'from-purple-600 to-purple-700', dots: 'from-purple-400/40 to-transparent' },
    'Océanie': { bg: 'from-teal-500 to-teal-600', dots: 'from-teal-300/40 to-transparent' },
    'Moyen-Orient': { bg: 'from-amber-600 to-amber-700', dots: 'from-amber-400/40 to-transparent' },
    'Antarctique': { bg: 'from-cyan-400 to-cyan-500', dots: 'from-cyan-200/40 to-transparent' },
  };
  
  const getColorScheme = (continent: string) => {
    return continentColorsMap[continent] || { bg: 'from-gray-600 to-gray-700', dots: 'from-gray-400/40 to-transparent' };
  };

  const continents = destinationsByContinent ? Object.keys(destinationsByContinent).sort() : [];

  return (
    <div>
      {/* Hero Section avec rectangles de continents */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Titre et texte flottants en haut au centre */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-center z-20 pointer-events-none pt-16 sm:pt-20 md:pt-24">
          <div className="text-center px-4">
            <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-2xl font-[Alro]">
              LES DESTINATIONS
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              Voyagez au cœur des plus belles destinations du monde à travers des
              itinéraires captivants et soigneusement conçus pour vous.
            </p>
          </div>
        </div>

        {/* Rectangles de continents en une seule ligne */}
        <div className="absolute inset-0 flex gap-0">
          {continents.map((continent) => {
            const colorScheme = getColorScheme(continent);
            const destinationCount = destinationsByContinent?.[continent]?.length || 0;
            const isSelected = selectedContinent === continent;
            
            return (
              <Link
                key={continent}
                href={`/destinations?continent=${encodeURIComponent(continent)}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedContinent(continent);
                  window.history.pushState({}, '', `/destinations?continent=${encodeURIComponent(continent)}`);
                }}
                className={`group relative flex-1 overflow-hidden hover:flex-[1.2] transition-all duration-500 ease-in-out ${
                  isSelected ? 'flex-[1.3] ring-4 ring-white/50' : ''
                }`}
              >
                {/* Fond coloré avec dégradé */}
                <div className={`absolute inset-0 bg-gradient-to-b ${colorScheme.bg}`}></div>
                
                {/* Effet de points en dégradé (style de l'image) */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-b ${colorScheme.dots}`}
                  style={{
                    backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    opacity: 0.6
                  }}
                ></div>
                
                {/* Dégradé pour la lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                
                {/* Contenu centré */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 text-center">
                    {continent}
                  </h3>
                  <p className="text-white/90 text-base sm:text-lg lg:text-xl font-medium text-center">
                    {destinationCount} {destinationCount > 1 ? 'destinations' : 'destination'}
                  </p>
                </div>
                
                {/* Effet hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Destinations Grid */}
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
              Voir toutes les destinations
            </button>
          </div>
        </div>
      )}
      <DestinationsGrid 
        destinations={filteredDestinations}
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
