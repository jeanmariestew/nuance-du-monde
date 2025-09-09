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
  const price = offer.price_from?.toLocaleString("fr-FR") || "";
  const currency = offer.price_currency || "$";
  const imageUrl =
    offer.image_main || offer.image_url || "/images/default-destination.jpg";
  const category = offer.travel_types?.[0]?.title || "Voyage";
  const description = offer.short_description || "";
  return (
    <Link href={`/offers/${offer.slug}`} className="block">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-2xl mx-auto hover:shadow-xl transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Image */}
          <div className="relative h-64 md:h-full">
            <Image
              src={imageUrl}
              alt={destination}
              fill
              className="object-cover"
            />
            {/* Overlay text */}
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-medium">{category}</p>
              <h3 className="text-xl font-bold">{destination}</h3>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-yellow-600 mb-4">
                {title}
              </h2>

              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 mt-1">
                  <img
                    src="/images/moving.map.png"
                    alt=""
                    className="w-5 h-5 text-gray-600"
                  />
                  {/* <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg> */}
                </div>
                <div>
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {description}
                  </p>
                  {duration && (
                    <p className="text-gray-700 font-medium mt-2">{duration}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="border-2 border-blue-300 rounded-xl p-4 bg-blue-50/30">
              <p className="text-sm text-gray-600 mb-1">À partir de</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-yellow-600">
                  {currency}
                </span>
                <span className="text-2xl font-bold text-yellow-600">
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
