/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, MapPin, Clock } from 'lucide-react';
import { useDestinationsByContinent } from '@/hooks/useDestinationsByContinent';
import { Destination } from '@/types';

interface MobileDestinationsMenuProps {
  onClose: () => void;
}

const MobileDestinationsMenu: React.FC<MobileDestinationsMenuProps> = ({ onClose }) => {
  const [expandedContinent, setExpandedContinent] = useState<string | null>(null);
  const { destinations, isLoading, error, fetchDestinations, isDataLoaded } = useDestinationsByContinent();

  const handleContinentClick = async (continent: string) => {
    // Charger les données si pas encore fait
    if (!isDataLoaded && !isLoading) {
      await fetchDestinations();
    }
    
    if (expandedContinent === continent) {
      setExpandedContinent(null);
    } else {
      setExpandedContinent(continent);
    }
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return '';
    return `${price.toLocaleString()} ${currency || 'CAD'}`;
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
      <div className="px-4 py-2">
        <p className="text-red-600 text-sm">Erreur: {error}</p>
        <button 
          onClick={fetchDestinations}
          className="mt-2 text-sm text-indigo-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!destinations || Object.keys(destinations).length === 0) {
    return (
      <div className="px-4 py-2">
        <Link
          href="/destinations"
          className="block text-black text-center transition-colors py-2"
          onClick={onClose}
        >
          Toutes Nos destinations
        </Link>
      </div>
    );
  }

  const continents = Object.keys(destinations).sort();

  return (
    <div className="px-4">
      {/* Lien vers toutes les destinations */}
      <Link
        href="/destinations"
        className="block text-black text-center transition-colors py-2 border-b border-gray-200 mb-2"
        onClick={onClose}
      >
        Toutes Nos destinations
      </Link>

      {/* Liste des continents */}
      {continents.map((continent) => (
        <div key={continent} className="mb-2">
          <button
            onClick={() => handleContinentClick(continent)}
            className="w-full flex items-center justify-between py-3 text-left text-gray-800 hover:bg-gray-50 rounded-md px-2 transition-colors"
          >
            <span className="font-medium">{continent}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {destinations[continent]?.length || 0}
              </span>
              {expandedContinent === continent ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </button>

          {/* Liste des destinations pour ce continent */}
          {expandedContinent === continent && destinations[continent] && (
            <div className="ml-2 mt-2 space-y-2 max-h-64 overflow-y-auto bg-gray-50 rounded-lg p-2">
              {isLoading ? (
                <div className="py-4 text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mx-auto"></div>
                  <span className="text-sm text-gray-600 mt-2 block">Chargement...</span>
                </div>
              ) : (
                destinations[continent].map((destination: Destination) => (
                  <Link
                    key={destination.id}
                    href={`/destinations/${destination.slug}`}
                    onClick={onClose}
                    className="block bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all active:scale-95 touch-manipulation"
                  >
                    <div className="flex items-start gap-3">
                      {destination.banner_image_url && (
                        <div className="shrink-0 w-12 h-12 rounded-md overflow-hidden">
                          <img
                            src={destination.banner_image_url}
                            alt={destination.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-900 truncate">
                          {destination.title}
                        </h5>
                        {destination.short_description && (
                          <p className="text-xs text-gray-600 mt-1" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {destination.short_description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          {destination.price_from && (
                            <span className="flex items-center gap-1 text-green-700">
                              <MapPin className="h-3 w-3" />
                              {formatPrice(destination.price_from, destination.price_currency)}
                            </span>
                          )}
                          {(destination.duration_days || destination.duration_nights) && (
                            <span className="flex items-center gap-1 text-blue-700">
                              <Clock className="h-3 w-3" />
                              {formatDuration(destination.duration_days, destination.duration_nights)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
              {destinations[continent].length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">
                  Aucune destination disponible
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileDestinationsMenu;
