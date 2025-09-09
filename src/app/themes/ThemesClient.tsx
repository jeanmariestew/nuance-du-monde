'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TravelTheme } from "@/types";

export default function ThemesClient() {
  const [themes, setThemes] = useState<TravelTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch("/api/travel-themes?active=true");
        const data = await response.json();
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
      <section className="relative h-80 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image src="/images/themes_banner.jpeg" alt="Les thèmes" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold">LES THÈMES</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {themes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Aucun thème disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {themes.map((theme) => (
                <Link key={theme.id} href={`/themes/${theme.slug}`} className="group">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      {theme.image_url ? (
                        <Image
                          src={theme.image_url}
                          alt={theme.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Pas d&apos;image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-semibold">{theme.title}</h3>
                      </div>
                    </div>
                    {theme.short_description && (
                      <div className="p-6">
                        <p className="text-gray-600 line-clamp-3">{theme.short_description}</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
