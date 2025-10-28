"use client";

interface DateOption {
  id: number;
  departure_date: string;
  return_date?: string;
  price?: number;
  price_currency?: string;
  status?: string;
}

interface DatesAndPricingProps {
  dates?: DateOption[];
  basePrice?: number;
  baseCurrency?: string;
  title?: string;
}

export default function DatesAndPricing({
  dates = [],
  basePrice,
  baseCurrency = "$",
  title = "Dates et prix",
}: DatesAndPricingProps) {
  if (!dates || dates.length === 0) {
    return null;
  }


  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="site-section bg-gray-50">
      <div className="site-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-gray-900">
            {title}
          </h2>
          <button className="text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>

        {/* Section Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 sm:mb-8">Les départs</h3>

        {/* Dates Grid */}
        <div className="relative">
          {/* Navigation Arrows - Hidden on mobile */}
          <button className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div className="overflow-x-auto pb-4 hide-scrollbar -mx-4 sm:mx-0">
            <div className="flex gap-4 sm:gap-6 min-w-max px-4 sm:px-2">
              {dates.map((date, index) => (
                <div
                  key={date.id || index}
                  className="flex-shrink-0 w-[280px] sm:w-[300px] bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-yellow-300"
                >
                  {/* Dates */}
                  <div className="mb-6 sm:mb-8">
                    <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                      {formatDateShort(date.departure_date)}
                    </p>
                    {date.return_date && (
                      <p className="text-sm sm:text-base text-gray-600 font-medium">
                        AU {formatDateShort(date.return_date)}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6 sm:mb-8">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 uppercase tracking-wide">prix à partir de</p>
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                      {date.price || basePrice}
                      <span className="text-lg sm:text-xl ml-1">{date.price_currency || baseCurrency}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                      par pers. en occ. double. Inclut le rabais paiement par chèque ou vir.
                    </p>
                  </div>

                  {/* Supplement */}
                  <div className="mb-6 sm:mb-8">
                    <label className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input type="radio" className="mt-0.5 sm:mt-1 w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600 focus:ring-yellow-500" />
                      <span className="leading-tight">
                        +1595$ Supplément occupation simple
                      </span>
                    </label>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl hover:scale-105">
                    Consulter ce voyage
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
