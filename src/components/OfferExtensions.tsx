"use client";

import { useState, useEffect, useCallback } from "react";
import OptimizedImage from "./OptimizedImage";

interface ExtensionImage {
  id?: number;
  image_url: string;
  alt_text?: string;
}

interface Extension {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  duration_days?: number;
  duration_nights?: number;
  price?: number;
  price_currency?: string;
  price_note?: string;
  itinerary?: string;
  images?: ExtensionImage[];
}

interface OfferExtensionsProps {
  extensions: Extension[];
}

// Parse l'itinéraire pour extraire les jours structurés
function parseItinerary(itinerary: string) {
  const lines = itinerary.split("\n");
  const days: { dayNum: string; title: string; content: string[] }[] = [];
  let currentDay: { dayNum: string; title: string; content: string[] } | null = null;

  for (const line of lines) {
    if (line.match(/^Jour\s+\d+/i)) {
      if (currentDay) days.push(currentDay);
      const dayNum = line.match(/\d+/)?.[0] || "";
      const title = line.replace(/^Jour\s+\d+\s*:?\s*/i, "");
      currentDay = { dayNum, title, content: [] };
    } else if (currentDay && line.trim()) {
      currentDay.content.push(line.trim());
    }
  }
  if (currentDay) days.push(currentDay);
  return days;
}

export default function OfferExtensions({ extensions }: OfferExtensionsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(
    extensions.length > 0 ? extensions[0].id : null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});

  // Défilement automatique du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newState = { ...prev };
        extensions.forEach(ext => {
          const images = ext.images || [];
          if (images.length > 1) {
            newState[ext.id] = ((prev[ext.id] || 0) + 1) % images.length;
          }
        });
        return newState;
      });
    }, 4000); // Change toutes les 4 secondes

    return () => clearInterval(interval);
  }, [extensions]);

  const nextImage = useCallback((extId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [extId]: ((prev[extId] || 0) + 1) % totalImages
    }));
  }, []);

  const prevImage = useCallback((extId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [extId]: ((prev[extId] || 0) - 1 + totalImages) % totalImages
    }));
  }, []);

  if (!extensions || extensions.length === 0) {
    return null;
  }

  return (
    <section className="">
      <div className="site-container">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs sm:text-sm font-bold text-yellow-700 uppercase tracking-wider">
              Prolongez votre voyage
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-gray-900 mb-4 sm:mb-6 px-4">
            Extensions disponibles
          </h2>
        </div>

        {/* Extensions list */}
        <div className="space-y-8">
          {extensions.map((ext) => {
            const isExpanded = expandedId === ext.id;
            const imgIndex = currentImageIndex[ext.id] || 0;
            const images = ext.images || [];
            const days = ext.itinerary ? parseItinerary(ext.itinerary) : [];
            
            return (
              <div
                key={ext.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Header avec mini carrousel - Always visible */}
                <div
                  className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : ext.id)}
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Mini carrousel quand fermé */}
                    {!isExpanded && images.length > 0 && (
                      <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-lg relative">
                        <OptimizedImage
                          key={`mini-${ext.id}-${imgIndex}`}
                          src={images[imgIndex].image_url}
                          alt={images[imgIndex].alt_text || ext.title}
                          fill
                          className="object-cover"
                        />
                        {images.length > 1 && (
                          <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                            {imgIndex + 1}/{images.length}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                        {ext.title}
                      </h3>
                      {ext.subtitle && (
                        <p className="text-sm sm:text-base text-gray-600 mb-3">
                          {ext.subtitle}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {ext.duration_days && (
                          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full font-medium">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {ext.duration_days} jour{ext.duration_days > 1 ? "s" : ""}
                            {ext.duration_nights ? ` / ${ext.duration_nights} nuit${ext.duration_nights > 1 ? "s" : ""}` : ""}
                          </span>
                        )}
                        {ext.price && (
                          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-yellow-500 text-white px-3 py-1.5 rounded-full font-bold">
                            A partir de {ext.price} {ext.price_currency || "$"}
                            {ext.price_note && <span className="font-normal opacity-90"> ({ext.price_note})</span>}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Bouton expand */}
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white shadow-xl border-2 sm:border-4 border-white self-start">
                      <svg
                        className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded content - Grid layout */}
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {ext.description && (
                      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                        <p className="text-sm capitalize sm:text-base text-gray-700 leading-relaxed">{ext.description}</p>
                      </div>
                    )}

                    {/* Grid: Carousel left, Itinerary right - une seule colonne si pas d'images */}
                    <div className={`grid grid-cols-1 ${images.length > 0 ? 'lg:grid-cols-2' : ''} gap-6 sm:gap-8 lg:gap-10 p-4 sm:p-6`}>
                      {/* Left: Grand Carousel - seulement si images */}
                      {images.length > 0 && (
                        <div className="order-2 lg:order-1">
                          <div className="sticky top-20 sm:top-24 h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white">
                            <div className="relative w-full h-full">
                              <OptimizedImage
                                key={`full-${ext.id}-${imgIndex}`}
                                src={images[imgIndex].image_url}
                                alt={images[imgIndex].alt_text || `${ext.title} - Image ${imgIndex + 1}`}
                                fill
                                className="object-cover transition-opacity duration-500"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                              />
                              
                              {/* Navigation arrows */}
                              {images.length > 1 && (
                                <>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(ext.id, images.length); }}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                                  >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(ext.id, images.length); }}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all"
                                  >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                  
                                  {/* Dots indicator */}
                                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {images.map((_, idx) => (
                                      <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => ({ ...prev, [ext.id]: idx })); }}
                                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                                          idx === imgIndex ? "bg-yellow-500 scale-125" : "bg-white/70 hover:bg-white"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  
                                  {/* Counter */}
                                  <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs sm:text-sm px-2 py-1 rounded">
                                    {imgIndex + 1} / {images.length}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Right: Itinerary avec traits verticaux */}
                      <div className="order-1 lg:order-2">
                        <div className="h-[300px] sm:h-[400px] lg:h-[500px] overflow-y-auto pr-1 sm:pr-2">
                          {days.length > 0 ? (
                            <div className="space-y-6 sm:space-y-8">
                              {days.map((day, index) => (
                                <div key={index} className="relative">
                                  {/* Timeline connector - trait vertical jaune */}
                                  {index < days.length - 1 && (
                                    <div className="absolute left-[19px] sm:left-[23px] top-12 sm:top-14 bottom-0 w-0.5 sm:w-1 bg-linear-to-b from-yellow-500 via-yellow-400 to-yellow-300" />
                                  )}

                                  {/* Day content */}
                                  <div className="flex gap-3 sm:gap-5">
                                    {/* Day number circle */}
                                    <div className="shrink-0 relative z-10">
                                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-xl border-2 sm:border-4 border-white">
                                        {day.dayNum}
                                      </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 pb-3 sm:pb-4">
                                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                                        {day.title}
                                      </h4>
                                      {day.content.map((line, lineIdx) => {
                                        const mealKeywords = ["Déjeuner", "Dîner", "Souper", "Petit-déjeuner"];
                                        const isMealLine = mealKeywords.some(word => line.startsWith(word));
                                        const isTransport = line.toLowerCase().startsWith("transport");
                                        const isHebergement = line.toLowerCase().startsWith("hébergement") || line.toLowerCase().startsWith("hebergement");
                                        
                                        // Fonction pour mettre en majuscule la première lettre
                                        const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
                                        
                                        if (isMealLine) {
                                          return (
                                            <p key={lineIdx} className="text-sm sm:text-base text-yellow-700 font-semibold mb-1">
                                              {capitalize(line)}
                                            </p>
                                          );
                                        }
                                        if (isTransport) {
                                          return (
                                            <p key={lineIdx} className="text-sm sm:text-base mb-1">
                                              <span className="text-blue-600 font-semibold">Transports : </span>
                                              <span className="text-gray-700">{capitalize(line.replace(/^transports?\s*:?\s*/i, ""))}</span>
                                            </p>
                                          );
                                        }
                                        if (isHebergement) {
                                          return (
                                            <p key={lineIdx} className="text-sm sm:text-base mb-1">
                                              <span className="text-green-600 font-semibold">Hébergement : </span>
                                              <span className="text-gray-700">{capitalize(line.replace(/^h[ée]bergements?\s*:?\s*/i, ""))}</span>
                                            </p>
                                          );
                                        }
                                        return (
                                          <p key={lineIdx} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-1">
                                            {capitalize(line)}
                                          </p>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-gray-500 text-sm sm:text-base">Programme non disponible</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
