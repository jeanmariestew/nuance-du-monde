'use client';

import Image from 'next/image';
import Link from 'next/link';
import OfferCard from '@/components/cards/OfferCard';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Destination, Offer } from '@/types';

export default function DestinationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${slug}`);
        const data = await response.json();
        
        if (data.success) {
          setDestination(data.data);
        } else {
          setError(data.error || 'Destination non trouvée');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la destination:', error);
        setError('Erreur lors du chargement de la destination');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDestination();
      // Fetch offers for this destination
      const fetchOffers = async () => {
        setOffersLoading(true);
        try {
          const res = await fetch(`/api/offers?destination=${encodeURIComponent(slug)}`);
          const data = await res.json();
          if (data.success) setOffers(data.data as Offer[]);
          else setOffersError(data.error || 'Aucune offre trouvée pour cette destination');
        } catch (err) {
          console.error('Erreur lors du chargement des offres pour la destination:', err);
          setOffersError((err as Error).message || 'Erreur lors du chargement des offres');
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la destination...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Destination non trouvée</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link 
            href="/destinations"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          {destination.banner_image_url ? (
            <Image
              src={destination.banner_image_url}
              alt={destination.title}
              fill
              className="object-cover"
            />
          ) : destination.image_url ? (
            <Image
              src={destination.image_url}
              alt={destination.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{destination.title}</h1>
          {destination.short_description && (
            <p className="text-xl">{destination.short_description}</p>
          )}
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <ol className="flex space-x-2 text-sm">
            <li><Link href="/" className="text-blue-600 hover:underline">Accueil</Link></li>
            <li className="text-gray-500">/</li>
            <li><Link href="/destinations" className="text-blue-600 hover:underline">Destinations</Link></li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700">{destination.title}</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {destination.description && (
                <div className="prose max-w-none mb-10">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: destination.description }}
                  />
                </div>
              )}

              {/* Available Dates */}
              {destination.available_dates && (
                <div className="bg-blue-50 p-6 rounded-lg mb-12">
                  <h3 className="text-xl font-semibold mb-4">Dates disponibles</h3>
                  <div className="flex flex-wrap gap-2">
                    {(typeof destination.available_dates === 'string' 
                      ? JSON.parse(destination.available_dates) 
                      : destination.available_dates
                    )?.map((date: string, index: number) => (
                      <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {date}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Offers for this Destination */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Offres au {destination.title}</h2>
                {offersLoading && (
                  <p className="text-gray-600">Chargement des offres…</p>
                )}
                {offersError && !offersLoading && (
                  <p className="text-red-600 mb-4">{offersError}</p>
                )}
                {!offersLoading && !offersError && offers.length === 0 && (
                  <p className="text-gray-600">Aucune offre n’est disponible pour cette destination pour le moment.</p>
                )}
                <div className="space-y-6">
                  {offers.map((offer) => (
                    <OfferCard key={offer.slug} offer={offer} />
                  ))}
                </div>
              </div>

              {/* End destination content */}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
                <h3 className="text-xl font-semibold mb-6">Informations du voyage</h3>
                
                {destination.price_from && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">À partir de</span>
                    <div className="text-2xl font-bold text-blue-600">
                      {destination.price_from} {destination.price_currency}
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  {destination.duration_days && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée:</span>
                      <span className="font-semibold">
                        {destination.duration_days} jours / {destination.duration_nights} nuits
                      </span>
                    </div>
                  )}

                  {destination.group_size_min && destination.group_size_max && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taille du groupe:</span>
                      <span className="font-semibold">
                        {destination.group_size_min === destination.group_size_max 
                          ? `${destination.group_size_min} personnes`
                          : `${destination.group_size_min}-${destination.group_size_max} personnes`
                        }
                      </span>
                    </div>
                  )}
                </div>

                <Link 
                  href={`/offers?destination=${destination.slug}`}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                >
                  Voir les offres pour cette destination
                </Link>

                <Link 
                  href={`/demander-devis?destination=${destination.slug}`}
                  className="w-full btn-accent text-black py-3 px-6 rounded-lg font-semibold  transition-colors text-center block mt-3"
                >
                  Demander un devis
                </Link>

                <Link 
                  href="/contact"
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Autres destinations qui pourraient vous intéresser</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Placeholder for related destinations */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Destination similaire</h3>
                <p className="text-gray-600 mb-4">Description courte de la destination...</p>
                <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                  Découvrir
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

