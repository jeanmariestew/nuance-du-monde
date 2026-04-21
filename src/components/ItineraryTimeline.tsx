"use client";

import clsx from "clsx";
import OptimizedImage from "./OptimizedImage";

interface DayItinerary {
  day: number;
  title: string;
  description: string;
  location?: string;
  activities?: string;
  meals?: string;
  transports?: string;
  accommodation?: string;
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
  is_starting_price?: boolean;
}

interface ItineraryTimelineProps {
  itinerary: DayItinerary[];
  introduction?: string;
  dayOptions?: DayOption[];
  onDayClick?: (dayIndex: number) => void;
}

export default function ItineraryTimeline({
  itinerary,
  introduction,
  dayOptions,
  onDayClick,
}: ItineraryTimelineProps) {
  // Grouper les options par jour
  const optionsByDay: Record<number, DayOption[]> = {};
  if (dayOptions) {
    dayOptions.forEach((opt) => {
      if (!optionsByDay[opt.day_number]) {
        optionsByDay[opt.day_number] = [];
      }
      optionsByDay[opt.day_number].push(opt);
    });
  }
  if (itinerary.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Aucun itinéraire disponible</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-1 sm:pr-2">
      {/* Introduction / Points forts */}
      {introduction && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 ">
          <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
            {introduction.split("\n").map((line, idx) => {
              if (
                line.includes("Nos expériences") ||
                line.includes('Nos expériences "Plus"')
              ) {
                return (
                  <p key={idx} className="font-bold text-gray-900">
                    {line}
                  </p>
                );
              }
              return <p key={idx}>{line}</p>;
            })}
          </div>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {itinerary.map((day, index) => (
          <div 
            key={day.day} 
            className={`relative ${onDayClick ? 'cursor-pointer hover:bg-yellow-50/50 rounded-lg transition-colors -mx-2 px-2 py-1' : ''}`}
            onClick={() => onDayClick?.(index)}
          >
            {/* Timeline connector */}
            {index < itinerary.length - 1 && (
              <div className="absolute  sm:left-[23px] top-12 sm:top-14 bottom-0 w-0.5 sm:w-1 bg-linear-to-b from-yellow-500 via-yellow-400 to-yellow-300" />
            )}

            {/* Day content */}
            <div className="flex gap-3 sm:gap-5">
              {/* Day number circle */}
              <div className="shrink-0 relative z-10">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-xl border-2 sm:border-4 border-white ${onDayClick ? 'hover:scale-110 transition-transform' : ''}`}>
                  {day.day}
                </div>
              </div>

              {/* Content without card */}
              <div className="flex-1 pb-3 sm:pb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                  {day.title}
                </h3>
                {/* {day.location && (
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base font-semibold text-yellow-700">
                      {day.location}
                    </span>
                  </div>
                )} */}
                {/* Description générale */}
                {day.description && (
                  <div className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                    {day.description.split(/\.\s+/).filter(Boolean).map((sentence, idx) => (
                      <p key={idx} className="first-letter:uppercase">
                        {sentence.trim()}{idx < day.description.split(/\.\s+/).filter(Boolean).length - 1 ? '.' : ''}
                      </p>
                    ))}
                  </div>
                )}

                {/* Catégories avec couleurs distinctes */}
                <div className="space-y-2 mt-3">
                  {/* Activités - Orange */}
                  {day.activities && (
                    <div className="gap-2">
                      <span className="font-semibold mr-2 text-sm sm:text-base shrink-0">
                        Activités :
                      </span>
                      <span className="text-sm sm:text-base text-gray-700 first-letter:uppercase">
                        {day.activities.split(/\.\s+/).filter(Boolean).map((sentence, idx, arr) => (
                          <span key={idx}>
                            {sentence.trim()}{idx < arr.length - 1 ? '.' : ''}
                            {idx < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}

                  {/* Repas - Rose/Fuchsia */}
                  {day.meals && (
                    <div className=" gap-2">
                      <span className="font-semibold mr-2 text-sm sm:text-base shrink-0">
                        Repas :
                      </span>
                      <span className="text-sm sm:text-base text-gray-700 first-letter:uppercase">
                        {day.meals}
                      </span>
                    </div>
                  )}

                  {/* Hébergement - Vert */}
                  {day.accommodation && (
                    <div className=" gap-2">
                      <span className="font-semibold mr-2 text-sm sm:text-base shrink-0">
                        Hébergement: 
                      </span>
                      <span className="text-sm sm:text-base text-gray-700 first-letter:uppercase">
                        {day.accommodation}
                      </span>
                    </div>
                  )}

                  {/* Transport - Bleu */}
                  {day.transports && (
                    <div className="gap-2">
                      <span className="font-semibold mr-2 text-sm sm:text-base shrink-0">
                        Transport :
                      </span>
                      <span className="text-sm sm:text-base text-gray-700 first-letter:uppercase">
                        {day.transports}
                      </span>
                    </div>
                  )}
                </div>

                {/* Options d'activités */}
                {optionsByDay[day.day] && optionsByDay[day.day].length > 0 && (
                  <div className="mt-4 p-3 sm:p-4 rounded-xl border-4 border-yellow-200">
                    <div className="text-sm w-full sm:text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      En options
                    </div>
                    <div className="space-y-5 ">
                      {optionsByDay[day.day].map((option, optIdx) => (
                        <div key={optIdx} className={clsx("gap-3",optIdx > 0 && " border-t pt-4 ")}>
                          <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm sm:text-base text-gray-900">
                                {option.title}
                              </span>
                              {!!option.is_included && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  Inclus
                                </span>
                              )}
                              {option.price_supplement && Number(option.price_supplement) > 0 && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                  {option.is_starting_price ? "À partir de ": '+'}{option.price_supplement} {option.price_currency || 'CAD'}
                                </span>
                              )}
                            </div>
                          <div className="flex gap-3 min-w-0">
                            
                            {option.image_url && (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative rounded-lg overflow-hidden">
                                <OptimizedImage
                                  src={option.image_url}
                                  alt={option.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            {option.description && (
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
