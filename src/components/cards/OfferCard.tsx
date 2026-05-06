"use client";

import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import type { Offer } from "@/types";

type Props = { offer: Offer }; 

export default function OfferCard({ offer }: Props) {
  // Extract data from offer
  const destination = offer.destinations?.[0]?.title || offer.title;
  const destinations = offer.destinations?.map(d => d.title) || [];
  const type = offer.travel_types?.[0]
  const title = offer.title;
  const duration = offer.duration_days
    ? `${offer.duration_days} jours et ${offer.duration_nights} nuits`
    : "";
  const price = offer.price_from !== undefined && offer.price_from !== null
    ? new Intl.NumberFormat('fr-FR').format(offer.price_from)
    : "";
  const currency = offer.price_currency || "$";
  const imageUrl = offer.images?.[0]
    ? offer.images?.[0].image_url
    : offer.image_main ||
      (offer.image_url && offer.image_url) ||
      "/images/destination_fond.png";
  const category = offer.meta_title || "Voyage";
  const description = offer.label || "";

  // Compute the next upcoming date range for the pill
  const now = new Date();
  const sortedDates = (offer.dates || [])
    .slice()
    .sort((a, b) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime());
  const nextRange = sortedDates.find(d => new Date(d.departure_date) >= new Date(now.toDateString()));
  const formatRange = (dep?: string, ret?: string | null) => {
    if (!dep) return null;
    const d = new Date(dep);
    if (!ret) return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const r = new Date(ret);
    const sameMonth = d.getFullYear() === r.getFullYear() && d.getMonth() === r.getMonth();
    const startFmt: Intl.DateTimeFormatOptions = sameMonth ? { day: '2-digit' } : { day: '2-digit', month: '2-digit' };
    const endFmt: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return `${d.toLocaleDateString('fr-FR', startFmt)} → ${r.toLocaleDateString('fr-FR', endFmt)}`;
  };
  return (
    <Link href={`/offers/${offer.slug}`} className="block group h-full">
      <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border-gray-200 border-2 transition-all duration-300 group-hover:border-yellow-400 h-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-5 flex-1">
          {/* Left side - Image */}
          <div className="relative md:col-span-2 h-[220px] md:h-auto">
            <OptimizedImage
              src={imageUrl}
              alt={destination}
              fill
              className="object-cover p-2 rounded-3xl group-hover:scale-105 transition-transform duration-500"
              onError={(e: any) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/destination_fond.png";
              }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent m-2 rounded-xl" />
            {/* Overlay text */}
            <div className="absolute bottom-4 left-4 text-white z-10">
              {/* <h3 className="text-xl sm:text-2xl font-bold drop-shadow-lg">{destination}</h3> */}
              {destinations.map((e, i) => 
                <p key={i} className="flex items-center gap-1 text-sm sm:text-base font-medium opacity-90">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {e}
                </p>
              )}
            </div>
            <div>{JSON.stringify(type)}</div>
            {/* Label badge */}
            {offer.label && (
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-gray-900 shadow">
                  {offer.label}
                </span>
              </div>
            )}
          </div>

          {/* Right side - Content */}
          <div className="md:col-span-3 p-5 sm:p-6 flex flex-col justify-between h-full">
            <div className="flex-1">
              <h2 className="text-base sm:text-lg text-yellow-500 font-[Alro] uppercase leading-snug line-clamp-3">
                {title}
              </h2>

              <div className="flex flex-col mb-2">
                {description && (
                  <p className="text-gray-800 font-semibold text-sm sm:text-base leading-relaxed line-clamp-2">
                    {description}
                  </p>
                )}
                {duration && (
                  <p className="flex items-center gap-1.5 text-gray-700 font-medium text-sm sm:text-base">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-yellow-500" />
                    {duration}
                  </p>
                )}
                {nextRange && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold border border-yellow-300 self-start">
                    <span>Prochain départ</span>
                    <span className="truncate">{formatRange(nextRange.departure_date, nextRange.return_date || undefined)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price section */}
            <div className="border-2 border-gray-200 rounded-xl p-2 bg-linear-to-br from-yellow-50 to-orange-50 mt-auto">
              <p className="text-sm text-gray-600 mb-1">À partir de</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-yellow-600">
                  {currency} {price}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">/ personne</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
