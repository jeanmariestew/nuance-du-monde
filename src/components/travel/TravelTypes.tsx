"use client";

import Link from "next/link";
import Image from "next/image";
import { TravelType } from "@/types";

interface TravelTypesProps {
  travelTypes: TravelType[];
}

export default function TravelTypes({ travelTypes }: TravelTypesProps) {
  if (!travelTypes || travelTypes.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {travelTypes.map((travelType) => (
        <div
          key={travelType.id}
          className="relative bg-cover bg-center h-[400px] rounded-lg overflow-hidden group cursor-pointer"
        >
          {travelType.image_url ? (
            <Image
              src={travelType.image_url}
              alt={travelType.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/destination_fond.png";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl mb-2">🌍</div>
                <p className="text-sm">Image à venir</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80"></div>
          <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-[Alro]">{travelType.title}</h3>
              {travelType.short_description && (
                <p className="text-sm leading-relaxed">
                  {travelType.short_description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Link
                href={`/type-de-voyage/${travelType.slug}`}
                className="bg-[#d9a900] text-white text-sm px-4 py-2 rounded font-semibold   transition-colors"
              >
                Explorer
              </Link>
              <div className="w-12 h-12 bg-gray-600/80 rounded-full flex items-center justify-center ripple-container">
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="w-3 h-3 bg-[#d9a900] rounded-full pulse-animation"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
