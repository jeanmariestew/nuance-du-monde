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
      <div className="bg-white rounded-3xl overflow-hidden max-w-2xl mx-auto shadow-2xl border-gray-200 border-[2px] hover:shadow-xl transition-shadow h-[300px]">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left side - Image */}
          <div className="relative h-[300px]">
            <Image
              src={imageUrl}
              alt={destination}
              fill
              className="object-cover p-2 rounded-l-3xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/destination_fond.png";
              }}
            />
            {/* Overlay text */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold">{destination}</h3>
              <p className="text-sm font-medium">{category}</p>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="p-6 flex flex-col justify-between h-full">
            <div className="flex-1 overflow-y-auto pr-2">
              <h2 className="text-2xl text-yellow-500 mb-4 font-[Alro]">
                {title}
              </h2>

              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 mt-1">
                  <img
                    src="/images/moving.map.png"
                    alt=""
                    className="w-5 h-5 text-gray-600"
                  />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold text-xs leading-relaxed">
                    {description}
                  </p>
                  {duration && (
                    <p className="text-gray-700 font-semibold text-xs">{duration}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="border-2 border-gray-300 rounded-xl p-4 bg-blue-50/30 mt-4 flex-shrink-0">
              <p className="text-sm text-gray-600 mb-1">À partir de</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-yellow-500">
                  {currency}
                </span>
                <span className="text-xl font-bold text-yellow-500">
                  {price}
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
