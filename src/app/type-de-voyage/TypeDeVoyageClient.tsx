"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TravelType } from "@/types";
import TravelTypesSection from "@/components/TravelTypesSection";
import ValuesSection from "@/components/ValuesSection";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

export default function TypeDeVoyageClient() {
  const [types, setTypes] = useState<TravelType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/travel-types?active=true");
        const data = await response.json();
        if (data.success) setTypes(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des types de voyage:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-y-10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonLoader variant="card" count={6} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10">
      <section className="relative h-[500px] sm:h-[600px] md:h-[650px] flex items-start py-3 sm:py-4 md:py-5 flex-col justify-end">
        <div className="absolute inset-0">
          <Image
            src="/images/photo_type-de-voyage.png"
            alt="Type de voyage"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
        <div className="relative z-10 text-left text-white px-4 sm:px-6 md:px-8 max-w-2xl">
          <div className="inline-block bg-yellow-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            Catégorie
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 font-[Alro] uppercase">
            TYPE DE VOYAGE
          </h1>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed">
            Que vous soyez en groupe, en solo ou en voyage d&apos;affaires, nos
            différents types de voyage vous invitent à une expérience
            enrichissante et taillée sur mesure.
          </p>
        </div>
      </section>
      <div className="px-4 sm:px-6 md:px-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-yellow-500 font-[Alro] uppercase">
          Type de voyage
        </h2>
        <p className="text-sm sm:text-base md:text-lg leading-relaxed">
          Inspirez-vous avec nos sélections exclusives de voyages pour une
          immersion authentique dans des destinations fascinantes à travers le
          monde.
        </p>
      </div>
      <TravelTypesSection travelTypes={types} />
      <ValuesSection />
    </div>
  );
}
