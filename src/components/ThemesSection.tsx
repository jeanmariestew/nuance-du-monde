"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { TravelTheme } from "@/types";
import ThemeCard from "@/components/cards/ThemeCard";

interface ThemesSectionProps {
  travelThemes: TravelTheme[];
}

export default function ThemesSection({ travelThemes }: ThemesSectionProps) {
  const themeSliderRef = useRef<HTMLDivElement>(null);

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

  if (travelThemes.length === 0) return null;

  return (
    <>
      {/* Thèmes Section - Header */}
      <section className="bg-gray-50">
        <div className="mx-auto">
          <div className="relative grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="relative h-full overflow-hidden flex items-center justify-center">
              <Image
                src="/images/fond_theme.png"
                alt="Background themes"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0" />

              <div className="relative min-h-80 z-10 flex p-4 flex-col items-start justify-center w-full">

              {/* Icône circulaire exacte comme la capture */}
              <div className=" top-0 left-8 w-16 h-16 bg-[#d9a900]/20 rounded-full flex items-center justify-center ripple-container">
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="w-4 h-4 bg-[#d9a900] rounded-full pulse-animation"></div>
              </div>
                <h2 className="text-3xl font-bold mb-6 text-black tracking-wide font-[Alro] my-10">
                  LES THÈMES
                </h2>
                <Link
                  href="/themes"
                  className="bg-[#d9a900] text-sm text-white px-6 py-3 rounded   transition-colors inline-block mt-8"
                >
                  Voir tous les thèmes
                </Link>
              </div>
            </div>
            <div className="relative min-h-80 overflow-hidden">
              <Image
                src="/images/a-la-une-2-1.png"
                alt="Themes"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Thèmes - Slider */}
      <section>
        <div className="relative">
          {/* Nav buttons (desktop only) */}
          <button
            aria-label="Précédent"
            onClick={() => scrollByAmount(themeSliderRef.current, "left")}
            className="hidden md:flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
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
            onClick={() => scrollByAmount(themeSliderRef.current, "right")}
            className="hidden md:flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
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
            ref={themeSliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 ml-4 px-4"
          >
            {travelThemes.slice(0, 20).map((t) => (
              <div
                key={t.id}
                className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-[32%]"
              >
                <ThemeCard theme={t} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
