"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TravelType } from "@/types";

export default function TravelTypesPage() {
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
          <p className="mt-4 text-gray-600">Chargement des types de voyage...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-80 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image src="/images/type_de_voyage_banner.webp" alt="Type de voyage" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold">TYPE DE VOYAGE</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {types.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Aucun type disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {types.map((type) => (
                <Link key={type.id} href={`/type-de-voyage/${type.slug}`} className="group">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      {type.image_url ? (
                        <Image
                          src={type.image_url}
                          alt={type.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Pas d'image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                      {type.short_description && (
                        <p className="text-gray-600 line-clamp-3">{type.short_description}</p>
                      )}
                    </div>
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
