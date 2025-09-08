"use client";

import OfferCard from '@/components/cards/OfferCard';
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface OfferListItem {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  image_main?: string;
  price?: number;
  price_currency?: string;
}

function OffersListContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const type = searchParams.get("type");
  const theme = searchParams.get("theme");

  const [offers, setOffers] = useState<OfferListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (type) params.set("type", type);
    if (theme) params.set("theme", theme);
    return params.toString();
  }, [destination, type, theme]);

  useEffect(() => {
    const load = async () => {
      try {
        const url = "/api/offers" + (queryString ? `?${queryString}` : "");
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) setOffers(data.data);
        else setError(data.error || "Erreur lors du chargement des offres");
      } catch (err) {
        setError((err as Error).message || "Erreur réseau lors du chargement des offres");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [queryString]);

  const pageTitle = useMemo(() => {
    if (destination) return `Offres pour la destination: ${destination}`;
    if (type) return `Offres par type de voyage: ${type}`;
    if (theme) return `Offres pour le thème: ${theme}`;
    return "Toutes nos offres";
  }, [destination, type, theme]);

  return (
    <div>
      <section className="bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{pageTitle}</h1>
          <p className="text-gray-600 mt-2">Découvrez nos propositions soigneusement sélectionnées.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-gray-600">Chargement des offres...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : offers.length === 0 ? (
            <div className="text-center text-gray-700">Aucune offre trouvée.</div>
          ) : (
            <div className="space-y-6">
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

export default function OffersListPage() {
  return (
    <Suspense fallback={
      <div>
        <section className="bg-gray-100 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">Chargement des offres...</h1>
            <p className="text-gray-600 mt-2">Veuillez patienter...</p>
          </div>
        </section>
      </div>
    }>
      <OffersListContent />
    </Suspense>
  );
}
