"use client";

import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { TravelType } from "@/types";
import { useRef, useEffect } from "react";

interface TravelTypesProps {
  travelTypes: TravelType[];
}

export default function TravelTypes({ travelTypes }: TravelTypesProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const el = sliderRef.current;
      if (!el) return;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if (isAtEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  
  if (!travelTypes || travelTypes.length === 0) {
    return null;
  }

  const scrollByAmount = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.8;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };


  return (
    <div className="relative">
      {/* Nav buttons (desktop only) */}
      <button
        aria-label="Précédent"
        onClick={() => scrollByAmount("left")}
        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="#C8A341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        aria-label="Suivant"
        onClick={() => scrollByAmount("right")}
        className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="#C8A341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mr-4 px-4"
        style={{ scrollbarWidth: "none" }}
      >
        {travelTypes.map((travelType) => (
          <div
            key={travelType.id}
            className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-[32%]"
          >
            <div className="relative bg-cover bg-center h-[650px] rounded-lg overflow-hidden group cursor-pointer">
              {/* Badge Pro incliné */}
              {travelType.is_pro && (
                <div className="absolute top-4 right-[-35px] z-10 bg-black text-white text-xs font-bold py-1 px-10 rotate-45 shadow-lg">
                  PRO
                </div>
              )}
              {travelType.image_url ? (
                <OptimizedImage
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
                <div className="w-full h-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🌍</div>
                    <p className="text-base">Image à venir</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50"></div>
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-4 font-[Alro] uppercase">{travelType.title}</h3>
                  {travelType.short_description && (
                    <p className="text-base leading-relaxed">
                      {travelType.short_description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/type-de-voyage/${travelType.slug}`}
                    className="bg-[#d9a900] text-white text-base px-6 py-3 rounded font-semibold transition-colors"
                  >
                    Explorer
                  </Link>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center ripple-container"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
