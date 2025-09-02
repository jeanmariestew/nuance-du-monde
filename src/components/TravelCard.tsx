'use client';

import Image from 'next/image';

interface TravelCardProps {
  destination: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  currency: string;
  imageUrl: string;
  category?: string;
}

export default function TravelCard({
  destination,
  title,
  description,
  duration,
  price,
  currency,
  imageUrl,
  category = "Départs Garantis"
}: TravelCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-2xl mx-auto">
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
              {destination}
            </h2>
            
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {title}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {description}
                </p>
                <p className="text-gray-700 font-medium mt-2">
                  {duration}
                </p>
              </div>
            </div>
          </div>

          {/* Price section */}
          <div className="border-2 border-blue-300 rounded-xl p-4 bg-blue-50/30">
            <p className="text-sm text-gray-600 mb-1">À partir de</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-yellow-600">{currency}</span>
              <span className="text-3xl font-bold text-yellow-600">{price}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">/ personne</p>
          </div>
        </div>
      </div>
    </div>
  );
}
