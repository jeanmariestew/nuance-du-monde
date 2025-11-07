"use client";

import Image from "next/image";
import Link from "next/link";
import type { Offer } from "@/types";

type Props = { offer: Offer };

export default function OfferCard({ offer }: Props) {
  // Extract data from offer
  const destination = offer.destinations?.[0]?.title || offer.title;
  console.log("offer", offer);
  const title = offer.title;
  const duration = offer.duration_days
    ? `${offer.duration_days} jours et ${offer.duration_nights} nuits`
    : "";
  const price = offer.price_from?.toLocaleString("fr-FR") || "";
  const currency = offer.price_currency || "$";
  const imageUrl = offer.images?.[0]
    ? offer.images?.[0].image_url
    : offer.image_main ||
      (offer.image_url && offer.image_url) ||
      "/images/destination_fond.png";
  const category = offer.meta_title || "Voyage";
  const description = offer.label || "";
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
          </div>

          {/* Right side - Content */}
          <div className="md:col-span-3 p-5 sm:p-6 flex flex-col justify-between h-full">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl text-yellow-500 mb-3 font-[Alro] line-clamp-2 min-h-[3.5rem]">
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
