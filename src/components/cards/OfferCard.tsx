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
    <Link href={`/offers/${offer.slug}`} className="block">
      <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden max-w-2xl mx-auto shadow-lg sm:shadow-2xl border-gray-200 border-[1px] sm:border-[2px] hover:shadow-xl transition-shadow h-auto sm:h-[300px]">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left side - Image */}
          <div className="relative h-[200px] sm:h-[250px] md:h-[300px]">
            <Image
              src={imageUrl}
              alt={destination}
              fill
              className="object-cover p-1 sm:p-2 rounded-l-2xl sm:rounded-l-3xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/destination_fond.png";
              }}
            />
            {/* Overlay text */}
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
              <h3 className="text-lg sm:text-xl font-bold">{destination}</h3>
              <p className="text-xs sm:text-sm font-medium">{category}</p>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="p-4 sm:p-6 flex flex-col justify-between h-full min-h-[200px] sm:min-h-[300px]">
            <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
              <h2 className="text-lg sm:text-xl md:text-2xl text-yellow-500 mb-3 sm:mb-4 font-[Alro]">
                {title}
              </h2>

              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex-shrink-0 mt-1">
                  <img
                    src="/images/moving.map.png"
                    alt=""
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                  />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold text-xs sm:text-sm leading-relaxed">
                    {description}
                  </p>
                  {duration && (
                    <p className="text-gray-700 font-semibold text-xs sm:text-sm">{duration}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="border-2 border-gray-300 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-blue-50/30 mt-3 sm:mt-4 flex-shrink-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">À partir de</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold text-yellow-500">
                  {currency}
                </span>
                <span className="text-lg sm:text-xl font-bold text-yellow-500">
                  {price}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">/ personne</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
