"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TravelType } from "@/types";
import TravelTypesSection from "@/components/TravelTypesSection";
import ValuesSection from "@/components/ValuesSection";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Chargement des types de voyage...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10">
      <section className="relative h-96 flex items-start py-5 flex-col justify-end">
        <div className="absolute inset-0">
          <Image
            src="/images/photo_type-de-voyage.png"
            alt="Type de voyage"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60"></div>
        <div className="relative z-10 text-left text-white px-8 max-w-2xl">
          <div className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold mb-4">
            Catégorie
          </div>
          <h1 className="text-3xl font-bold mb-6 font-[Alro]">
            TYPE DE VOYAGE
          </h1>
          <p className="text-lg leading-relaxed">
            Que vous soyez en groupe, en solo ou en voyage d&apos;affaires, nos
            différents types de voyage vous invitent à une expérience
            enrichissante et taillée sur mesure.
          </p>
        </div>
      </section>
      <div className="px-10">
        <h2 className="text-2xl font-bold mb-6 text-yellow-500 font-[Alro]">
          Type de voyage
        </h2>
        <p className="text-lg leading-relaxed">
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
