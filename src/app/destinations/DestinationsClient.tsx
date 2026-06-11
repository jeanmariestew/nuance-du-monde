"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown } from "lucide-react";
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

function ContinentDropdown({ destinations }: { destinations: Destination[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const showArrows = destinations.length > 4;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [destinations]);

  const scrollUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    scrollRef.current?.scrollBy({ top: -120, behavior: "smooth" });
  };

  const scrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    scrollRef.current?.scrollBy({ top: 120, behavior: "smooth" });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-2xl py-1 px-2 min-w-[200px]">
      {showArrows && canScrollUp && (
        <button
          onClick={scrollUp}
          className="w-full flex justify-center py-1 text-white hover:text-white/60 transition-colors"
        >
          <ChevronUp size={18} strokeWidth={2.5} />
        </button>
      )}
      <div
        ref={scrollRef}
        className="max-h-[120px] overflow-y-scroll [&::-webkit-scrollbar]:hidden [scrollbar-width:none] space-y-1"
      >
        {destinations.map((dest) => (
          <Link
            key={dest.id}
            href={`/destinations/${dest.slug}`}
            className="block px-2 py-1 text-sm text-white rounded-md hover:bg-white/20 transition-colors duration-200 font-medium"
          >
            {dest.title}
          </Link>
        ))}
      </div>
      {showArrows && canScrollDown && (
        <button
          onClick={scrollDown}
          className="w-full flex justify-center py-1 text-white hover:text-white/60 transition-colors"
        >
          <ChevronDown size={18} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
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
            const continentDestinations = destinationsByContinent?.[continent] || [];
            
            return (
              <div
                key={continent}
                className={`group relative flex-1 overflow-visible hover:flex-[1.2] transition-all duration-500 ease-in-out ${
                  isSelected ? 'flex-[1.3] ring-4 ring-white/50' : ''
                }`}
              >
                <Link
                  href={`/destinations?continent=${encodeURIComponent(continent)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedContinent(continent);
                    window.history.pushState({}, '', `/destinations?continent=${encodeURIComponent(continent)}`);
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
                  </div>
                  
                  {/* Effet hover */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></div>
                </Link>

                {/* Menu déroulant des destinations au hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-12 transition-all duration-300 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <ContinentDropdown destinations={continentDestinations} />
                </div>
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
                  href={`/destinations?continent=${encodeURIComponent(continent)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedContinent(continent);
                    window.history.pushState({}, '', `/destinations?continent=${encodeURIComponent(continent)}`);
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
                  </div>
                </Link>
              );
            })}
          </div>
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
              Voir toutes nos destinations
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
