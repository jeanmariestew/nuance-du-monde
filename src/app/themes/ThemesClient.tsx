"use client";

import OptimizedImage from "@/components/OptimizedImage";
import { useEffect, useState } from "react";
import { TravelTheme } from "@/types";
import ThemeCard from "@/components/cards/ThemeCard";
import { ThemeCardSkeleton } from "@/components/ui/SkeletonLoader";
import OffersGrid from "@/components/OffersGrid";
import { api } from "@/lib/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ThemesClient() {
  const [themes, setThemes] = useState<TravelTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

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

  // Défilement automatique toutes les 5 secondes
  useEffect(() => {
    if (themes.length <= itemsPerPage) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = themes.length - itemsPerPage;
        // Boucle infinie: si on atteint la fin, on revient au début
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [themes.length]);

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
          <OptimizedImage
            src="/images/themes_banner.jpeg"
            alt="Nos thèmes"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-[Alro]">NOS THÈMES</h1>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16">
        <h2 className="uppercase text-xl sm:text-2xl text-yellow-500 font-semibold font-[Alro] px-4 sm:px-6 md:px-10 pb-6 sm:pb-8 md:pb-10 text-center">
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
            <>
              {/* Mobile: Grille 1 colonne */}
              <div className="grid grid-cols-1 lg:hidden gap-8">
                {themes.map((theme) => (
                  <ThemeCard theme={theme} key={theme.id} />
                ))}
              </div>

              {/* Desktop: Carousel */}
              <div className="hidden lg:block relative">
                {/* Boutons de navigation */}
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(themes.length - itemsPerPage, prev + 1))}
                  disabled={currentIndex >= themes.length - itemsPerPage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Container du carousel */}
                <div className="overflow-hidden">
                  <div
                    className="flex gap-8 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage + 2)}%)` }}
                  >
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        className="min-w-[calc(33.333%-1.33rem)] shrink-0"
                      >
                        <ThemeCard theme={theme} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indicateurs (dots) */}
                {themes.length > itemsPerPage && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: Math.ceil(themes.length - itemsPerPage + 1) }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          currentIndex === i
                            ? "bg-yellow-500 scale-110"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
      <OffersGrid itemsPerPage={10} hasTheme/>
    </div>
  );
}
