/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { api } from '@/lib/axios';

interface TravelType {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  image_url?: string;
}

interface TravelTypesDropdownProps {
  onClose?: () => void;
}

const TravelTypesDropdown: React.FC<TravelTypesDropdownProps> = ({ onClose }) => {
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTravelTypes = async () => {
      try {
        const response = await api.get('/travel-types?active=true');
        const data = response.data;
        setTravelTypes(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelTypes();
  }, []);

  const handleClick = () => {
    onClose?.();
  };

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
          <span className="text-sm text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <p className="text-red-600 text-sm">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div 
      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 w-[600px] max-w-[95vw]"
      style={{ zIndex: 1000 }}
    >
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 px-3 py-3 border-b border-gray-100 mb-3">
          Types de voyage
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {travelTypes.map((type) => (
            <Link
              key={type.id}
              href={`/type-de-voyage/${type.slug}`}
              onClick={handleClick}
              className="block px-4 py-4 rounded-lg hover:bg-yellow-50 transition-all duration-200 border border-transparent hover:border-yellow-100 hover:shadow-sm group"
            >
              <div className="flex items-start gap-3">
                {type.image_url ? (
                  <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={type.image_url}
                      alt={type.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="shrink-0 w-16 h-16 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Compass className="h-8 w-8 text-yellow-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors mb-1">
                    {type.title}
                  </h5>
                  {type.short_description && (
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {type.short_description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {travelTypes.length === 0 && (
          <div className="px-3 py-8 text-center">
            <Compass className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Aucun type de voyage disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelTypesDropdown;
