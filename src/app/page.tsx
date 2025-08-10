'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NewsletterForm from '@/components/NewsletterForm';
import { Destination, TravelType, TravelTheme, Testimonial } from '@/types';

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [travelThemes, setTravelThemes] = useState<TravelTheme[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Charger les données depuis l'API
    const fetchData = async () => {
      try {
        const [destRes, typesRes, themesRes, testimonialsRes] = await Promise.all([
          fetch('/api/destinations?active=true&limit=4'),
          fetch('/api/travel-types?active=true'),
          fetch('/api/travel-themes?active=true&limit=4'),
          fetch('/api/testimonials?featured=true&active=true&limit=6')
        ]);

        const [destData, typesData, themesData, testimonialsData] = await Promise.all([
          destRes.json(),
          typesRes.json(),
          themesRes.json(),
          testimonialsRes.json()
        ]);

        if (destData.success) setDestinations(destData.data);
        if (typesData.success) setTravelTypes(typesData.data);
        if (themesData.success) setTravelThemes(themesData.data);
        if (testimonialsData.success) setTestimonials(testimonialsData.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/homepage_banner.webp"
            alt="Nuance du Monde - Voyage sur mesure"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            NUANCE DU MONDE<br />
            VOTRE SPÉCIALISTE DU<br />
            VOYAGE SUR MESURE
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Créez avec nous votre voyage sur mesure, partout dans le monde. 
            Nous vous faisons vivre des expériences authentiques et confortables, 
            et ce, au meilleur prix du marché.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="text"
              placeholder="Rechercher une destination..."
              className="px-6 py-3 rounded-lg text-gray-900 w-full sm:w-80"
            />
            <button className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Rechercher
            </button>
          </div>
          <Link 
            href="/destinations"
            className="inline-block mt-8 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Explorer les thèmes et destinations
          </Link>
        </div>
      </section>

      {/* Type de voyage Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">TYPE DE VOYAGE</h2>
              <p className="text-lg text-gray-600 mb-8">
                Que vous soyez en groupe, en solo ou en voyage d'affaires, nos différents types de voyage 
                vous invitent à une expérience enrichissante et taillée sur mesure.
              </p>
            </div>
            <div>
              <Image
                src="/images/type_voyage_banner.webp"
                alt="Type de voyage"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {travelTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {type.image_url && (
                  <div className="relative h-48">
                    <Image
                      src={type.image_url}
                      alt={type.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                  <p className="text-gray-600 mb-4">{type.short_description}</p>
                  <Link 
                    href={`/type-de-voyage/${type.slug}`}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors inline-block"
                  >
                    Explorer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/destinations_banner.webp"
                alt="Destinations"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">LES DESTINATIONS</h2>
              <p className="text-lg text-gray-600 mb-8">
                Voyagez au cœur des plus belles destinations du monde à travers des itinéraires 
                captivants et soigneusement conçus pour vous.
              </p>
              <Link 
                href="/destinations"
                className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-block"
              >
                Voir toutes les destinations
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {destinations.map((destination) => (
              <Link 
                key={destination.id}
                href={`/destinations/${destination.slug}`}
                className="group"
              >
                <div className="relative h-64 rounded-lg overflow-hidden">
                  {destination.image_url && (
                    <Image
                      src={destination.image_url}
                      alt={destination.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{destination.title}</h3>
                    <button className="mt-2 bg-orange-500 text-white px-4 py-1 rounded text-sm hover:bg-orange-600 transition-colors">
                      Explorer
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Thèmes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">LES THÈMES</h2>
            <Link 
              href="/themes"
              className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-block"
            >
              Voir tous les thèmes
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelThemes.map((theme) => (
              <Link 
                key={theme.id}
                href={`/themes/${theme.slug}`}
                className="group"
              >
                <div className="relative h-64 rounded-lg overflow-hidden">
                  {theme.image_url && (
                    <Image
                      src={theme.image_url}
                      alt={theme.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">{theme.title}</h3>
                    <button className="mt-2 bg-orange-500 text-white px-4 py-1 rounded text-sm hover:bg-orange-600 transition-colors">
                      Explorer
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">
              ILS ONT VOYAGÉ AVEC NOUS _ INSPIREZ-VOUS DE LEURS AVIS
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Découvrez comment nos séjours sur mesure ont transformé les voyages de nos clients en aventures inoubliables. 
              Nous avons conçu des itinéraires personnalisés pour répondre à des besoins spécifiques, qu'il s'agisse de 
              vacances en famille, de voyages romantiques ou d'expéditions culturelles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  {testimonial.client_avatar ? (
                    <Image
                      src={testimonial.client_avatar}
                      alt={testimonial.client_name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {testimonial.client_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.client_name}</h4>
                    {testimonial.rating && (
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.testimonial_text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partenaires Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-yellow-600">
            NOS PARTENAIRES AGENCES DE VOYAGE
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-12">
            Nuance du Monde collabore avec des agences de voyage dévouées qui se distinguent par leur engagement 
            envers l'excellence. Ensemble, nous créons des expériences de voyage à la carte et riches, 
            alliant passion et expertise pour offrir à nos clients des aventures uniques.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Caroline Racine', 'Cathérine', 'Lyne', 'Sonia Gioffre'].map((partner, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h4 className="font-semibold">{partner}</h4>
                <p className="text-sm text-gray-600">Partenaire agence</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterForm />
    </div>
  );
}

