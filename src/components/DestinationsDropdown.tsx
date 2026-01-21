/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, MapPin, Clock } from 'lucide-react';
import { useDestinationsByContinent } from '@/hooks/useDestinationsByContinent';
import { Destination } from '@/types';

interface DestinationsDropdownProps {
  onClose?: () => void;
}

const DestinationsDropdown: React.FC<DestinationsDropdownProps> = ({ onClose }) => {
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { destinations, isLoading, error, fetchDestinations, isDataLoaded } = useDestinationsByContinent();

  useEffect(() => {
    setIsVisible(true);
    // Charger les données dès que le composant est monté
    if (!isDataLoaded && !isLoading) {
      fetchDestinations();
    }
  }, [fetchDestinations, isDataLoaded, isLoading]);

  const handleContinentHover = (continent: string) => {
    setHoveredContinent(continent);
  };


  // Pas de gestion des événements de souris ici - tout est géré par le Header

  const handleDestinationClick = () => {
    onClose?.();
  };

  const formatPrice = (price?: number, currency?: string) => {
    console.log('currency', currency);
    if (!price) return '';
    return `À partir de ${price.toLocaleString()} ${ 'CAD'}`;
  };

  const formatDuration = (days?: number, nights?: number) => {
    if (!days && !nights) return '';
    if (days && nights) return `${days}j/${nights}n`;
    if (days) return `${days} jours`;
    if (nights) return `${nights} nuits`;
    return '';
  };

  if (error) {
    return (
      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <p className="text-red-600 text-sm">Erreur: {error}</p>
        <button 
          onClick={fetchDestinations}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          <span className="text-sm text-gray-600">Chargement des destinations...</span>
        </div>
      </div>
    );
  }

  if (!destinations || Object.keys(destinations).length === 0) {
    return (
      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <p className="text-gray-600 text-sm">Aucune destination disponible</p>
      </div>
    );
  }

  const continents = Object.keys(destinations).sort();

  return (
    <div 
      ref={dropdownRef}
      className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } w-[720px] max-w-[95vw]`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex" style={{ minHeight: '300px', maxHeight: '500px' }}>
        {/* Colonne des continents */}
        <div className="w-72 min-w-[240px] border-r border-gray-200 shrink-0">
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-900 px-3 py-3 border-b border-gray-100 mb-2">Destinations par continent</h3>
            {continents.map((continent) => (
              <div
                key={continent}
                className={`flex items-center justify-between px-3 py-3 rounded-md cursor-pointer transition-colors ${
                  hoveredContinent === continent ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onMouseEnter={() => handleContinentHover(continent)}
              >
                <span className="text-sm font-medium">{continent}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">
                    {destinations[continent].length}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne des destinations */}
        {hoveredContinent && destinations[hoveredContinent] && (
          <div className="flex-1 max-h-[450px] overflow-y-auto min-w-0">
            <div className="p-3">
              <h4 className="text-sm font-semibold text-gray-900 px-3 py-3 border-b border-gray-100 sticky top-0 bg-white mb-2">
                {hoveredContinent} ({destinations[hoveredContinent].length} destinations)
              </h4>
              <div className="space-y-2 pb-2">
                {destinations[hoveredContinent].map((destination: Destination) => (
                  <Link
                    key={destination.id}
                    href={`/destinations/${destination.slug}`}
                    onClick={handleDestinationClick}
                    className="block px-4 py-4 rounded-lg hover:bg-indigo-50 transition-all duration-200 border border-transparent hover:border-indigo-100 hover:shadow-sm group"
                  >
                    <div className="flex items-start gap-4">
                      {destination.banner_image_url && (
                        <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={destination.banner_image_url}
                            alt={destination.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors mb-1">
                          {destination.title}
                        </h5>
                        {destination.short_description && (
                          <p className="text-xs text-gray-600 leading-relaxed mb-3" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {destination.short_description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {destination.price_from && (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                              <MapPin className="h-3 w-3" />
                              {formatPrice(destination.price_from, destination.price_currency)}
                            </span>
                          )}
                          {(destination.duration_days || destination.duration_nights) && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                              <Clock className="h-3 w-3" />
                              {formatDuration(destination.duration_days, destination.duration_nights)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {destinations[hoveredContinent].length === 0 && (
                <div className="px-3 py-8 text-center">
                  <div className="text-gray-400 mb-2">
                    <MapPin className="h-8 w-8 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Aucune destination disponible pour {hoveredContinent}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationsDropdown;
