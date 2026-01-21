"use client";

interface DayItinerary {
  day: number;
  title: string;
  description: string;
  location?: string;
}

interface ItineraryTimelineProps {
  itinerary: DayItinerary[];
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  if (itinerary.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Aucun itinéraire disponible</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-1 sm:pr-2">
      <div className="space-y-6 sm:space-y-8">
        {itinerary.map((day, index) => (
          <div key={day.day} className="relative">
            {/* Timeline connector */}
            {index < itinerary.length - 1 && (
              <div className="absolute left-[19px] sm:left-[23px] top-12 sm:top-14 bottom-0 w-0.5 sm:w-1 bg-linear-to-b from-yellow-500 via-yellow-400 to-yellow-300" />
            )}

            {/* Day content */}
            <div className="flex gap-3 sm:gap-5">
              {/* Day number circle */}
              <div className="shrink-0 relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-xl border-2 sm:border-4 border-white">
                  {day.day}
                </div>
              </div>

              {/* Content without card */}
              <div className="flex-1 pb-3 sm:pb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                  {day.title}
                </h3>
                {day.location && (
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
                )}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {day.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
