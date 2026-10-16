"use client";

import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";
import { TravelTheme } from "@/types";
import ThemeCard from "@/components/cards/ThemeCard";

interface ThemesSectionProps {
  travelThemes: TravelTheme[];
}

export default function ThemesSection({ travelThemes }: ThemesSectionProps) {
  if (travelThemes.length === 0) return null;

  return (
    <>
      {/* Thèmes Section - Bannière fine */}
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

        {/* Titre centré, bouton centré juste en dessous */}
        <div className="mx-auto max-w-[1400px] px-4 py-5 flex flex-col items-center gap-3 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-[Alro] uppercase leading-tight">
            NOS THÈMES
          </h2>
          <Link
            href="/themes"
            className="bg-[#d9a900] text-sm text-white px-5 py-2 rounded transition-colors inline-block whitespace-nowrap"
          >
            Voir tous nos thèmes
          </Link>
        </div>
      </section>

      {/* Thèmes - Extrait en grille : 3x2 sur grand écran, 2x2 sinon */}
      <section>
        <div className="mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {travelThemes.slice(0, 6).map((t, i) => (
              <div key={t.id} className={i >= 4 ? "hidden lg:block" : undefined}>
                <ThemeCard theme={t} compact />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
