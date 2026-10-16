"use client";

import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ContinentCard from "@/components/cards/ContinentCard";
import { api } from "@/lib/axios";

// Images par continent (mêmes visuels que la page /destinations)
const CONTINENT_IMAGES: Record<string, string> = {
  "Afrique": "/images/afrique.jpg",
  "Amérique du Nord": "/images/amerique-du-nord.jpg",
  "Amérique du Sud": "/images/amerique-du-sud.jpg",
  "Asie": "/images/asie.jpg",
  "Europe": "/images/europe.jpg",
  "Océanie": "/images/oceanie.jpg",
  "Moyen-Orient": "/images/moyen-orient.jpg",
  "Antarctique": "/images/antarctique.jpg",
};

interface Continent {
  name: string;
  count: number;
}

export default function DestinationsSection() {
  const destSliderRef = useRef<HTMLDivElement>(null);
  const [continents, setContinents] = useState<Continent[]>([]);

  useEffect(() => {
    api
      .get("/destinations/continents")
      .then((res) => {
        if (res.data.success) setContinents(res.data.data);
      })
      .catch(() => {});
  }, []);

  const scrollByAmount = (
    element: HTMLDivElement | null,
    direction: "left" | "right"
  ) => {
    if (!element) return;
    const scrollAmount = element.clientWidth * 0.8;
    element.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Destinations Section - Bannière fine */}
      <section className="relative text-white overflow-hidden">
        {/* Fond texturé */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <OptimizedImage
            src="/images/texture.png"
            alt=""
            fill
            className="object-cover mix-blend-overlay"
            priority
          />
        </div>

        {/* Texte centré, bouton centré juste en dessous */}
        <div className="mx-auto max-w-[1400px] px-4 py-5 flex flex-col items-center gap-3 text-center">
          <div className="max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-1.5 text-white tracking-wide font-[Alro] uppercase leading-tight">
              NOS DESTINATIONS
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-snug text-balance">
              Voyagez au cœur des plus belles destinations du monde à travers
              des itinéraires captivants et soigneusement conçus pour vous.
            </p>
          </div>
          <Link
            href="/destinations"
            className="bg-[#d9a900] text-sm text-white px-5 py-2 rounded transition-colors inline-block whitespace-nowrap"
          >
            Voir toutes nos destinations
          </Link>
        </div>
      </section>

      {/* Continents - Slider */}
      {continents.length > 0 && (
        <section className="">
          <div className="mx-auto px-4">
            <div className="relative">
              {/* Nav buttons (desktop only) */}
              <button
                aria-label="Précédent"
                onClick={() => scrollByAmount(destSliderRef.current, "left")}
                className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="#C8A341"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                aria-label="Suivant"
                onClick={() => scrollByAmount(destSliderRef.current, "right")}
                className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="#C8A341"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                ref={destSliderRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mr-4 px-4"
              >
                {continents.map((c) => (
                  <div
                    key={c.name}
                    className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-[32%]"
                  >
                    <ContinentCard name={c.name} image={CONTINENT_IMAGES[c.name]} compact />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
