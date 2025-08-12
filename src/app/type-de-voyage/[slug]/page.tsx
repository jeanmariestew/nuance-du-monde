"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TravelType } from "@/types";

export default function TravelTypeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [type, setType] = useState<TravelType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchType = async () => {
      try {
        const response = await fetch(`/api/travel-types/${slug}`);
        const data = await response.json();
        if (data.success) setType(data.data);
        else setError(data.error || "Type non trouvé");
      } catch (e) {
        setError("Erreur lors du chargement du type de voyage");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchType();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement du type...</p>
        </div>
      </div>
    );
  }

  if (error || !type) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Type non trouvé</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link href="/type-de-voyage" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Retour aux types de voyage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-80 flex items-center justify-center">
        <div className="absolute inset-0">
          {type.image_url ? (
            <Image src={type.image_url} alt={type.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{type.title}</h1>
          {type.short_description && (
            <p className="text-lg md:text-xl mt-2 max-w-3xl mx-auto">{type.short_description}</p>
          )}
        </div>
      </section>

      <nav className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <ol className="flex space-x-2 text-sm">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Accueil
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/type-de-voyage" className="text-blue-600 hover:underline">
                Type de voyage
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700">{type.title}</li>
          </ol>
        </div>
      </nav>

      {type.description && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">{type.description}</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
