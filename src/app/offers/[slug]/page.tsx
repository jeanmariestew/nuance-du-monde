"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface OfferDetail {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  image_main?: string;
  price?: number;
  price_currency?: string;
  travel_types?: Array<{ id: number; title: string; slug: string }>;
  travel_themes?: Array<{ id: number; title: string; slug: string }>;
  destinations?: Array<{ id: number; title: string; slug: string }>;
  dates?: Array<{ id: number; departure_date: string; return_date?: string }>;
}

export default function OfferDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/offers/${slug}`);
        const data = await res.json();
        if (data.success) setOffer(data.data);
        else setError(data.error || "Offre non trouvée");
      } catch (err) {
        setError((err as Error).message || "Erreur lors du chargement de l&apos;offre");
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Offre non trouvée</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link href="/offers" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-80 flex items-center justify-center">
        <div className="absolute inset-0">
          {offer.image_main ? (
            <Image src={offer.image_main} alt={offer.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{offer.title}</h1>
          {offer.short_description && (
            <p className="text-lg md:text-xl mt-2 max-w-3xl mx-auto">{offer.short_description}</p>
          )}
        </div>
      </section>


      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {offer.description && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{offer.description}</div>
              </div>
            )}

            {offer.dates && offer.dates.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Dates de départ</h2>
                <ul className="space-y-2">
                  {offer.dates.map((d) => (
                    <li key={d.id} className="text-gray-700">
                      {new Date(d.departure_date).toLocaleDateString()} {d.return_date ? `→ ${new Date(d.return_date).toLocaleDateString()}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20 space-y-4">
              {offer.price && offer.price_currency && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">À partir de</span>
                  <div className="text-2xl font-bold text-blue-600">{offer.price} {offer.price_currency}</div>
                </div>
              )}

              {offer.destinations && offer.destinations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Destinations</h3>
                  <div className="flex flex-wrap gap-2">
                    {offer.destinations.map((d) => (
                      <Link key={d.id} href={`/offers?destination=${d.slug}`} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm">
                        {d.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {offer.travel_themes && offer.travel_themes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Thèmes</h3>
                  <div className="flex flex-wrap gap-2">
                    {offer.travel_themes.map((t) => (
                      <Link key={t.id} href={`/offers?theme=${t.slug}`} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm">
                        {t.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {offer.travel_types && offer.travel_types.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Types de voyage</h3>
                  <div className="flex flex-wrap gap-2">
                    {offer.travel_types.map((t) => (
                      <Link key={t.id} href={`/offers?type=${t.slug}`} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm">
                        {t.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link href={`/demander-devis?offer=${offer.slug}`} className="w-full btn-accent text-black py-3 px-6 rounded-lg font-semibold hover:brightness-95 transition-colors text-center block">
                Demander un devis
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
