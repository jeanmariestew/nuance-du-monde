"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(
    dates[0] || null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatPrice = (value?: number, currency?: string) => {
    if (value === undefined || value === null) return basePrice ? `${baseCurrency} ${new Intl.NumberFormat('fr-FR').format(basePrice)}` : "—";
    return `${currency || baseCurrency} ${new Intl.NumberFormat('fr-FR').format(value)}`;
  };

  const formatRange = (dep: string, ret?: string) => {
    const d = new Date(dep);
    const optsStart: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    if (!ret) return d.toLocaleDateString('fr-FR', optsStart);
    const r = new Date(ret);
    const sameMonth = d.getFullYear() === r.getFullYear() && d.getMonth() === r.getMonth();
    const startFmt: Intl.DateTimeFormatOptions = sameMonth ? { day: '2-digit' } : { day: '2-digit', month: '2-digit' };
    const endFmt: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return `${d.toLocaleDateString('fr-FR', startFmt)} → ${r.toLocaleDateString('fr-FR', endFmt)}`;
  };

  if (!dates || dates.length === 0) {
    return null;
  }

  // Obtenir tous les mois avec des dates disponibles
  const availableMonths = Array.from(
    new Set(
      dates.map((d) => {
        const date = new Date(d.departure_date);
        return `${date.getFullYear()}-${date.getMonth()}`;
      })
    )
  )
    .map((key) => {
      const [year, month] = key.split("-").map(Number);
      return new Date(year, month, 1);
    })
    .sort((a, b) => a.getTime() - b.getTime());

  // Dates disponibles pour le mois actuel
  const datesInCurrentMonth = dates.filter((d) => {
    const date = new Date(d.departure_date);
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateAvailable = (day: number) => {
    return datesInCurrentMonth.some((d) => {
      const date = new Date(d.departure_date);
      return date.getDate() === day;
    });
  };

  const getDateOption = (day: number) => {
    return datesInCurrentMonth.find((d) => {
      const date = new Date(d.departure_date);
      return date.getDate() === day;
    });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const previousMonth = () => {
    const currentIndex = availableMonths.findIndex(
      (m) =>
        m.getMonth() === currentMonth.getMonth() &&
        m.getFullYear() === currentMonth.getFullYear()
    );
    if (currentIndex > 0) {
      setCurrentMonth(availableMonths[currentIndex - 1]);
    }
  };

  const nextMonth = () => {
    const currentIndex = availableMonths.findIndex(
      (m) =>
        m.getMonth() === currentMonth.getMonth() &&
        m.getFullYear() === currentMonth.getFullYear()
    );
    if (currentIndex < availableMonths.length - 1) {
      setCurrentMonth(availableMonths[currentIndex + 1]);
    }
  };

  return (
    <section className="site-section bg-linear-to-b from-gray-50 to-white">
      <div className="site-container">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-gray-900">
            {title}
          </h2>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6 md:gap-8">
          {/* Calendrier */}
          <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl border-2 border-yellow-300 p-5 h-fit">
            {/* Navigation mois */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={previousMonth}
                className="p-2 bg-white hover:bg-yellow-100 rounded-lg transition-colors shadow-sm border border-yellow-200"
                disabled={
                  availableMonths.findIndex(
                    (m) =>
                      m.getMonth() === currentMonth.getMonth() &&
                      m.getFullYear() === currentMonth.getFullYear()
                  ) === 0
                }
              >
                <ChevronLeft className="w-4 h-4 text-yellow-700" />
              </button>
              <h3 className="text-base font-bold text-gray-900 capitalize">
                {monthName}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 bg-white hover:bg-yellow-100 rounded-lg transition-colors shadow-sm border border-yellow-200"
                disabled={
                  availableMonths.findIndex(
                    (m) =>
                      m.getMonth() === currentMonth.getMonth() &&
                      m.getFullYear() === currentMonth.getFullYear()
                  ) ===
                  availableMonths.length - 1
                }
              >
                <ChevronRight className="w-4 h-4 text-yellow-700" />
              </button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-bold text-yellow-800 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grille calendrier */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Espaces vides avant le premier jour */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Jours du mois */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isAvailable = isDateAvailable(day);
                const dateOption = getDateOption(day);
                const isSelected =
                  selectedDate && dateOption?.id === selectedDate.id;

                return (
                  <button
                    key={day}
                    onClick={() => dateOption && setSelectedDate(dateOption)}
                    disabled={!isAvailable}
                    className={`
                      aspect-square rounded-md flex items-center justify-center text-xs font-semibold transition-all
                      ${
                        isSelected
                          ? "bg-linear-to-br from-yellow-500 to-orange-500 text-white shadow-lg scale-110 ring-2 ring-yellow-600"
                          : isAvailable
                          ? "bg-white text-yellow-900 hover:bg-yellow-200 hover:scale-105 border-2 border-yellow-400 shadow-sm"
                          : "text-gray-300 cursor-not-allowed bg-gray-50"
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Légende */}
            <div className="mt-4 pt-3 border-t-2 border-yellow-300">
              <div className="flex items-center gap-3 text-xs font-medium text-gray-700">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-linear-to-br from-yellow-500 to-orange-500 ring-2 ring-yellow-600" />
                  <span>Sélectionné</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-white border-2 border-yellow-400" />
                  <span>Disponible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des dates + Détails */}
          <div className="space-y-5">
            {/* Liste des dates disponibles */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-300 p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-600" />
                Dates disponibles
              </h3>
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 sm:pr-2">
                {dates.map((date) => {
                  const isSelected = selectedDate?.id === date.id;
                  return (
                    <button
                      key={date.id}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full text-left p-4 rounded-xl transition-all border-2 flex items-center justify-between ${
                        isSelected
                          ? "bg-linear-to-r from-yellow-500 to-orange-500 text-white border-yellow-600 shadow-lg"
                          : "bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-gray-900"
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-900'} truncate`}>
                          {formatRange(date.departure_date, date.return_date)}
                        </p>
                        <p className={`text-xs ${isSelected ? 'text-yellow-100' : 'text-gray-600'}`}>
                          {date.return_date ? 'Date de retour incluse' : 'Départ unique'}
                        </p>
                      </div>
                      <div className={`text-right shrink-0`}>
                        <p className={`text-lg font-extrabold ${isSelected ? 'text-white' : 'text-yellow-600'}`}>
                          {formatPrice(date.price, date.price_currency)}
                        </p>
                        <p className={`text-[11px] ${isSelected ? 'text-yellow-100' : 'text-gray-500'}`}>/ personne</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Détails de la date sélectionnée */}
            {selectedDate && (
              <div className="bg-linear-to-br from-gray-800 to-black rounded-2xl shadow-xl border-2 border-yellow-600 p-6 text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-5">Détails du départ</h3>

                <div className="space-y-5">
                  {/* Date de départ */}
                  <div>
                    <p className="text-sm text-yellow-100 mb-2">
                      Date de départ
                    </p>
                    <p className="text-2xl font-bold">
                      {new Date(selectedDate.departure_date).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  {/* Date de retour */}
                  {selectedDate.return_date && (
                    <div>
                      <p className="text-sm text-yellow-100 mb-2">
                        Date de retour
                      </p>
                      <p className="text-xl font-semibold">
                        {new Date(selectedDate.return_date).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}

                  {/* Prix */}
                  <div className="pt-5 border-t-2 border-yellow-400">
                    <p className="text-sm text-yellow-100 mb-2">
                      Prix par personne
                    </p>
                    <p className="text-4xl sm:text-5xl font-bold">
                      {formatPrice(selectedDate.price, selectedDate.price_currency)}
                    </p>
                    <p className="text-sm text-yellow-100 mt-2">
                      en occupation double
                    </p>
                  </div>

                  {/* Bouton CTA */}
                  <Link
                    href={`/devis-personnalise?circuit=${encodeURIComponent(title)}`}
                    className="block w-full bg-white text-yellow-700 hover:bg-yellow-50 py-3.5 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 text-center"
                  >
                    Demander un devis pour cette période
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
