"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TravelTheme } from "@/types";
import ThemeCard from "@/components/cards/ThemeCard";
import { ThemeCardSkeleton } from "@/components/ui/SkeletonLoader";
import OffersGrid from "@/components/OffersGrid";
import { api } from "@/lib/axios";

export default function ThemesClient() {
  const [themes, setThemes] = useState<TravelTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await api.get("/travel-themes?active=true");
        const data = response.data;
        if (data.success) setThemes(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des thèmes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des thèmes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-[500px] sm:h-[600px] md:h-[650px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/themes_banner.jpeg"
            alt="Nos thèmes"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">NOS THÈMES</h1>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16">
        <h2 className="uppercase text-xl sm:text-2xl text-yellow-500 font-semibold font-[Alro] uppercase px-4 sm:px-6 md:px-10 pb-6 sm:pb-8 md:pb-10 text-center">
          Tous nos thèmes
        </h2>
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          {loading ? (
            <ThemeCardSkeleton count={6} />
          ) : themes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Aucun thème disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {themes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>
          )}
        </div>
      </section>
      <OffersGrid itemsPerPage={10}/>
    </div>
  );
}
