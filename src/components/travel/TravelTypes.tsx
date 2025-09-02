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
          {travelType.image_url && (
            <Image
              src={travelType.image_url}
              alt={travelType.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
            <div>
              <h3 className="text-2xl font-bold mb-4">{travelType.title}</h3>
              {travelType.short_description && (
                <p className="text-sm leading-relaxed">
                  {travelType.short_description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Link
                href={`/type-de-voyage/${travelType.slug}`}
                className="bg-[#d9a900] text-white px-6 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors"
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
