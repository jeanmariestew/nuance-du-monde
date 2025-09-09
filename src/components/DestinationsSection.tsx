"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Destination } from "@/types";
import DestinationCard from "@/components/cards/DestinationCard";

interface DestinationsSectionProps {
  destinations: Destination[];
}

export default function DestinationsSection({
  destinations,
}: DestinationsSectionProps) {
  const destSliderRef = useRef<HTMLDivElement>(null);

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
      {/* Destinations Section - Hero */}
      <section className="relative text-white overflow-hidden">
        <div className="w-full h-full">
          <div className="grid grid-rows-2 relative sm:grid-rows-1 sm:grid-cols-2 gap-0 h-full">
            <div>
              {/* Colonne droite - Image pleine hauteur */}
              <div className="relative h-full">
                <Image
                  src="/images/a-la-une-1-1.webp"
                  alt="Destinations - Personnes qui trinquent"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <Image
                src={"/images/plane.png"}
                className="absolute right-10 top-10 z-10 w-40"
                alt=""
                width={200}
                height={200}
              />
              {/* Colonne droite - Animations */}
              <div className="relative h-full flex items-center justify-center">
                {/* Point jaune avec animation */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center ripple-container">
                  <div className="ripple-wave"></div>
                  <div className="ripple-wave"></div>
                  <div className="ripple-wave"></div>
                  <div className="w-4 h-4 bg-[#d9a900] rounded-full pulse-animation"></div>
                </div>

                {/* Trajectoire en pointillés */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 400"
                >
                  <path
                    d="M100 100 Q200 50 300 150 T380 300"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="8,8"
                    fill="none"
                    opacity="0.6"
                  />
                </svg>

                {/* Avion animé */}
                <div className="airplane-container">
                  <svg
                    className="airplane"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Colonne gauche - Texte avec fond texturé */}
            <div className="relative flex flex-col justify-center px-4">
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src="/images/texture.png"
                  alt=""
                  fill
                  className="object-cover mix-blend-overlay"
                  priority
                />
              </div>
              {/* Icône circulaire exacte comme la capture */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center ripple-container">
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="w-4 h-4 bg-[#d9a900] rounded-full pulse-animation"></div>
              </div>

              <div className="my-20">
                <h2 className="text-3xl font-bold mb-6 text-white tracking-wide font-[Alro]">
                  LES DESTINATIONS
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Voyagez au cœur des plus belles destinations du monde à
                  travers des itinéraires captivants et soigneusement conçus
                  pour vous.
                </p>
                <Link
                  href="/destinations"
                  className="bg-[#d9a900] text-sm text-white px-6 py-3 rounded   transition-colors inline-block mt-8"
                >
                  Voir toutes les destinations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations - Slider */}
      {destinations.length > 0 && (
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
                {destinations.slice(0, 20).map((d) => (
                  <div
                    key={d.id}
                    className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-[32%]"
                  >
                    <DestinationCard destination={d} />
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
