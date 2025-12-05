"use client";

import Image from "next/image";
import Link from "next/link";
import type { Offer } from "@/types";

type Props = { offer: Offer }; 

export default function OfferCard({ offer }: Props) {
  // Extract data from offer
  const destination = offer.destinations?.[0]?.title || offer.title;
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
            <Image
              src={imageUrl}
              alt={destination}
              fill
              className="object-cover p-2 rounded-xl group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/destination_fond.png";
              }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent m-2 rounded-xl" />
            {/* Overlay text */}
            <div className="absolute bottom-4 left-4 text-white z-10">
              <h3 className="text-xl sm:text-2xl font-bold drop-shadow-lg">{destination}</h3>
              <p className="text-sm sm:text-base font-medium opacity-90">{category}</p>
            </div>
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
              <h2 className="text-xl sm:text-2xl text-yellow-500 mb-3 font-[Alro] uppercase line-clamp-2 min-h-[3.5rem]">
                {title}
              </h2>

              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 mt-1">
                  <Image
                    src="/images/moving.map.png"
                    alt=""
                    width={20}
                    height={20}
                    className="text-gray-600"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-semibold text-sm sm:text-base leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {description}
                  </p>
                  <p className="text-gray-700 font-medium text-sm sm:text-base mt-1 h-6">
                    {duration || '\u00A0'}
                  </p>
                  {nextRange && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold border border-yellow-300">
                      <span>Prochain départ</span>
                      <span className="truncate">{formatRange(nextRange.departure_date, nextRange.return_date || undefined)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="border-2 border-gray-200 rounded-xl p-4 bg-gradient-to-br from-yellow-50 to-orange-50 mt-auto">
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
