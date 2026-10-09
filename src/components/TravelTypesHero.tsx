"use client";

import OptimizedImage from "@/components/OptimizedImage";

export default function TravelTypesHero() {
  return (
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

      <div className="mx-auto max-w-4xl px-4 py-5 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-1.5 text-white tracking-wide font-[Alro] uppercase leading-tight">
          NOS TYPES DE VOYAGES
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 leading-snug text-balance">
          Que vous soyez en groupe, en solo ou en voyage d&apos;affaires, nos
          différents types de voyage vous invitent à une expérience
          enrichissante et taillée sur mesure.
        </p>
      </div>
    </section>
  );
}
