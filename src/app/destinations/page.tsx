'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Destination } from '@/types';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations?active=true');
        const data = await response.json();
        
        if (data.success) {
          setDestinations(data.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/destinations_banner.webp"
            alt="Les destinations"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">LES DESTINATIONS</h1>
          <p className="text-xl">
            Voyagez au cœur des plus belles destinations du monde à travers des itinéraires 
            captivants et soigneusement conçus pour vous.
          </p>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-8 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-lg italic text-gray-700">
            "Un voyage incroyable en Egypte ! Je recommande vivement."
          </blockquote>
          <cite className="block mt-2 font-semibold">Jenny Wilson</cite>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-yellow-600">
            TOUTES LES DESTINATIONS
          </h2>

          {destinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Aucune destination disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {destinations.map((destination) => (
                <Link 
                  key={destination.id}
                  href={`/destinations/${destination.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48">
                      {destination.image_url ? (
                        <Image
                          src={destination.image_url}
                          alt={destination.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Pas d'image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-semibold">{destination.title}</h3>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {destination.short_description && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {destination.short_description}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        {destination.price_from && (
                          <div className="text-lg font-semibold text-blue-600">
                            À partir de {destination.price_from} {destination.price_currency}
                          </div>
                        )}
                        
                        {destination.duration_days && (
                          <div className="text-sm text-gray-500">
                            {destination.duration_days} jours / {destination.duration_nights} nuits
                          </div>
                        )}
                      </div>
                      
                      <button className="w-full mt-4 btn-accent text-black py-2 rounded hover:brightness-95 transition-colors">
                        Découvrir
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="flex justify-center mt-12">
            <nav className="flex space-x-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">2</button>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">3</button>
              <span className="px-3 py-2">…</span>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">6</button>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Suivant »</button>
            </nav>
          </div>
        </div>
      </section>

      {/* Type de voyage Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Type de voyage</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Que vous soyez en groupe, en solo ou en voyage d'affaires, nos différents types de voyage 
            vous invitent à une expérience enrichissante et taillée sur mesure.
          </p>
        </div>
      </section>

      {/* Les thèmes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Les thèmes</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Voyagez au cœur des plus belles destinations du monde à travers des itinéraires 
            captivants et soigneusement conçus pour vous.
          </p>
          <Link 
            href="/themes"
            className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-block"
          >
            Voir toutes les destinations
          </Link>
        </div>
      </section>
    </div>
  );
}

