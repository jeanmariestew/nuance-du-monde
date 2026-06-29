"use client";

import { useState, useEffect, useCallback } from "react";
import OptimizedImage from "./OptimizedImage";

interface HotelImage {
  id?: number;
  image_url: string;
  alt_text?: string;
}

interface Hotel {
  id: number;
  name: string;
  location?: string;
  description?: string;
  images?: HotelImage[];
}

interface OfferHotelsProps {
  hotels: Hotel[];
}

export default function OfferHotels({ hotels }: OfferHotelsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});

  // Défilement automatique du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newState = { ...prev };
        hotels.forEach(hotel => {
          const images = hotel.images || [];
          if (images.length > 1) {
            newState[hotel.id] = ((prev[hotel.id] || 0) + 1) % images.length;
          }
        });
        return newState;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [hotels]);

  const nextImage = useCallback((hotelId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) + 1) % totalImages,
    }));
  }, []);

  const prevImage = useCallback((hotelId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) - 1 + totalImages) % totalImages,
    }));
  }, []);

  if (!hotels || hotels.length === 0) {
    return null;
  }

  return (
    <section className="">
      <div className="site-container">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h0M9 12h0M9 15h0" />
            </svg>
            <span className="text-xs sm:text-sm font-bold text-yellow-700 uppercase tracking-wider">
              Vos hébergements
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-gray-900 mb-4 sm:mb-6 px-4">
            Hôtels sélectionnés
          </h2>
        </div>

        <div
          className={
            hotels.length === 1
              ? "max-w-xl mx-auto"
              : "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          }
        >
          {hotels.map((hotel) => {
            const imgIndex = currentImageIndex[hotel.id] || 0;
            const images = hotel.images || [];

            return (
              <div
                key={hotel.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden"
              >
                {images.length > 0 && (
                  <div className="relative w-full h-56 sm:h-64">
                    <OptimizedImage
                      key={`hotel-${hotel.id}-${imgIndex}`}
                      src={images[imgIndex].image_url}
                      alt={images[imgIndex].alt_text || hotel.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(hotel.id, images.length)}
                          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => nextImage(hotel.id, images.length)}
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(prev => ({ ...prev, [hotel.id]: idx }))}
                              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                                idx === imgIndex ? "bg-yellow-500 scale-125" : "bg-white/70 hover:bg-white"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 leading-tight">
                    {hotel.name}
                  </h3>
                  {hotel.location && (
                    <p className="flex items-center gap-1.5 text-sm sm:text-base text-yellow-700 font-medium mb-3">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel.location}
                    </p>
                  )}
                  {hotel.description && (
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {hotel.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
