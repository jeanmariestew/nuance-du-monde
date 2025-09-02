"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Offer, TravelType } from "@/types";
import OfferCard from "@/components/cards/OfferCard";
import TravelCard from "@/components/TravelCard";

export default function TravelTypeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [type, setType] = useState<TravelType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState<string | null>(null);

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
    if (slug) {
      fetchType();
      // fetch offers for this travel type
      const fetchOffers = async () => {
        setOffersLoading(true);
        try {
          const res = await fetch(`/api/offers?type=${encodeURIComponent(slug)}`);
          const data = await res.json();
          if (data.success) setOffers(data.data as Offer[]);
          else setOffersError(data.error || "Aucune offre trouvée pour ce type");
        } catch (err) {
          console.error("Erreur lors du chargement des offres (type):", err);
          setOffersError((err as Error).message || "Erreur lors du chargement des offres");
        } finally {
          setOffersLoading(false);
        }
      };
      fetchOffers();
    }
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


      {/* <section className="py-6">
        <div className="container mx-auto px-4">
          <Link
            href={`/offers?type=${type.slug}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir les offres pour ce type
          </Link>
        </div>
      </section> */}

      {/* Offres pour ce type */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Offres pour ce type</h2>
          {offersLoading && (
            <div className="text-gray-600">Chargement des offres…</div>
          )}
          {offersError && (
            <div className="text-red-600">{offersError}</div>
          )}
          {!offersLoading && !offersError && offers.length === 0 && (
            <div className="text-gray-600">Aucune offre pour ce type.</div>
          )}
          {offers.length > 0 && (
            <div className="grid grid-cols-2 gap-6">
              {offers.map((offer) => (
                <OfferCard key={offer.slug} offer={offer} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
