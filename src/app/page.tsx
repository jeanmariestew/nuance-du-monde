'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NewsletterForm from '@/components/NewsletterForm';
import HeroAnimated from '@/components/HeroAnimated';
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
      {/* Hero animé */}
      <HeroAnimated />

      {/* Nouvelle section: Liste des destinations avec compte de voyages */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Nos destinations populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {destinations.map((dest) => (
              <Link key={dest.id} href={`/destinations/${dest.slug}`} className="block p-4 bg-white rounded shadow hover:shadow-md">
                <span className="font-semibold">{dest.title.toUpperCase()}:</span> {dest.voyage_count || 0} voyages en {dest.title}
              </Link>
            ))}
          </div>
          {/* Pagination placeholder */}
          <div className="flex justify-center mt-4">
            <nav className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-200 rounded">1</button>
              <button className="px-3 py-1 bg-gray-200 rounded">2</button>
              <span>...</span>
              <button className="px-3 py-1 bg-gray-200 rounded">Suivant »</button>
            </nav>
          </div>
        </div>
      </section>

      {/* Type de voyage Section - Intégration parfaite */}
      <section className="relative bg-black text-white overflow-hidden h-[500px]">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
            {/* Colonne gauche - Texte */}
            <div className="relative flex flex-col justify-center px-8 lg:px-16">
              {/* Icône circulaire exacte comme la capture */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center ripple-container">
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="w-4 h-4 bg-yellow-400 rounded-full pulse-animation"></div>
              </div>
              
              <div className="mt-16">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white tracking-wide">
                  TYPE DE VOYAGE
                </h2>
                <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-md">
                  Que vous soyez en groupe, en solo ou en voyage d'affaires, nos différents types de 
                  voyage vous invitent à une expérience enrichissante et taillée sur mesure.
                </p>
              </div>
            </div>
            
            {/* Colonne droite - Image pleine hauteur */}
            <div className="relative h-full">
              <Image
                src="/images/a-la-une-3.jpg"
                alt="Type de voyage - Vue urbaine"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Types de voyage - 3 cartes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Circuits départs garantis */}
            <div className="relative bg-cover bg-center h-[400px] rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/images/circuits_departs_garantis.webp"
                alt="Circuits départs garantis"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Nos circuits départs Garantis</h3>
                  <p className="text-sm leading-relaxed">
                    Voyagez l'esprit tranquille avec nos départs garantis, préparez vos valises, l'évasion commence ici!
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors">
                    Explorer
                  </button>
                  <div className="w-12 h-12 bg-gray-600/80 rounded-full flex items-center justify-center ripple-container">
                    <div className="ripple-wave"></div>
                    <div className="ripple-wave"></div>
                    <div className="ripple-wave"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full pulse-animation"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Voyages en individuel */}
            <div className="relative bg-cover bg-center h-[400px] rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/images/voyages_individuel.webp"
                alt="Voyages en individuel"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Nos voyages en individuel</h3>
                  <p className="text-sm leading-relaxed">
                    Nos circuits individuels pour une aventure personnalisée à votre image et pour plonger librement dans chaque exploration.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors">
                    Explorer
                  </button>
                  <div className="w-12 h-12 bg-gray-600/80 rounded-full flex items-center justify-center ripple-container">
                    <div className="ripple-wave"></div>
                    <div className="ripple-wave"></div>
                    <div className="ripple-wave"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full pulse-animation"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Voyages en groupe */}
            <div className="relative bg-cover bg-center h-[400px] rounded-lg overflow-hidden group cursor-pointer">
              <Image
                src="/images/voyages_en_groupe.webp"
                alt="Voyages en groupe"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Nos voyages en groupe</h3>
                  <p className="text-sm leading-relaxed">
                    Découvrez le monde ensemble avec nos voyages de groupe sur mesure, conçus pour des souvenirs partagés.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors">
                    Explorer
                  </button>
                  <div className="w-12 h-12 bg-gray-600/80 rounded-full flex items-center justify-center ripple-container">
                    <div className="ripple-wave"></div>
                    <div className="ripple-wave"></div>
                    <div className="ripple-wave"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full pulse-animation"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section - Nouveau design */}
      <section className="relative bg-black text-white overflow-hidden h-[500px]">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full items-center">
            {/* Colonne gauche - Image */}
            <div className="relative h-full">
              <Image
                src="/images/a-la-une-1-1.webp"
                alt="Destinations - Personnes qui trinquent"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            
            {/* Colonne centre - Texte */}
            <div className="relative flex flex-col justify-center px-8 lg:px-16">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white tracking-wide">
                  LES DESTINATIONS
                </h2>
                <p className="text-lg lg:text-xl text-gray-300 leading-relaxed mb-8 max-w-md">
                  Voyagez au cœur des plus belles destinations du monde à travers des itinéraires 
                  captivants et soigneusement conçus pour vous.
                </p>
                <Link 
                  href="/destinations"
                  className="bg-yellow-400 text-black px-6 py-3 rounded font-semibold hover:bg-yellow-300 transition-colors inline-block"
                >
                  Voir toutes les destinations
                </Link>
              </div>
            </div>
            
            {/* Colonne droite - Animations */}
            <div className="relative h-full flex items-center justify-center">
              {/* Point jaune avec animation */}
              <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center ripple-container">
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="w-4 h-4 bg-yellow-400 rounded-full pulse-animation"></div>
              </div>
              
              {/* Trajectoire en pointillés */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                <path
                  d="M100 100 Q200 50 300 150 T380 300"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="8,8"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
              
              {/* Avion animé */}
              <div className="airplane-container">
                <svg className="airplane" width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
            </div>
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
                    <button className="mt-2 btn-accent text-black px-4 py-1 rounded text-sm hover:brightness-95 transition-colors">
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

