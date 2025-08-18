'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import NewsletterForm from '@/components/NewsletterForm';
import HeroAnimated from '@/components/HeroAnimated';
import { Destination, TravelType, TravelTheme, Testimonial } from '@/types';
import DestinationCard from '@/components/cards/DestinationCard';
import ThemeCard from '@/components/cards/ThemeCard';
import { SLIDER_INTERVAL_MS } from '@/lib/ui';

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [travelThemes, setTravelThemes] = useState<TravelTheme[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const destSliderRef = useRef<HTMLDivElement>(null);
  const themeSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Charger les données depuis l'API
    const fetchData = async () => {
      try {
        const [destRes, typesRes, themesRes, testimonialsRes] = await Promise.all([
          fetch('/api/destinations?active=true&limit=20'),
          fetch('/api/travel-types?active=true'),
          fetch('/api/travel-themes?active=true&limit=20'),
          fetch('/api/testimonials?featured=true&active=true&published=true&limit=6')
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

  // Auto-scroll destinations slider
  useEffect(() => {
    const container = destSliderRef.current;
    if (!container) return;

    let timer: NodeJS.Timeout | null = null;
    const start = () => {
      stop();
      timer = setInterval(() => {
        if (!container) return;
        const nearEnd =
          container.scrollLeft + container.clientWidth >= container.scrollWidth - 8;
        if (nearEnd) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
          return;
        }
        const step = getSingleCardStep(container);
        container.scrollBy({ left: step, behavior: 'smooth' });
      }, SLIDER_INTERVAL_MS);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    start();
    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);
    return () => {
      stop();
      container.removeEventListener('mouseenter', stop);
      container.removeEventListener('mouseleave', start);
    };
  }, [destinations.length]);

  // Helpers for nav buttons
  const getSingleCardStep = (el: HTMLDivElement) => {
    // step = 1 card width + gap (gap-6 = 24px)
    const gapPx = 24;
    const first = el.querySelector<HTMLElement>(':scope > *');
    if (!first) return Math.max(320, Math.floor(el.clientWidth * 0.8));
    return Math.ceil(first.offsetWidth + gapPx);
  };

  const scrollByAmount = (el: HTMLDivElement | null, dir: 'left' | 'right') => {
    if (!el) return;
    const step = getSingleCardStep(el);
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  // Auto-advance testimonials
  useEffect(() => {
    if (!testimonials.length) return;
    const id = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, SLIDER_INTERVAL_MS);
    return () => clearInterval(id);
  }, [testimonials.length]);

  const prevTestimonial = () => {
    if (!testimonials.length) return;
    setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };
  const nextTestimonial = () => {
    if (!testimonials.length) return;
    setTestimonialIndex((i) => (i + 1) % testimonials.length);
  };

  return (
    <div>
      {/* Hero animé */}
      <HeroAnimated />

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
      {/* Destinations - Slider auto */}
      {destinations.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">Nos destinations</h2>
              <Link
                href="/destinations"
                className="bg-yellow-500 text-gray-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Voir tout
              </Link>
            </div>

            <div className="relative">
              {/* Nav buttons (desktop only) */}
              <button
                aria-label="Précédent"
                onClick={() => scrollByAmount(destSliderRef.current, 'left')}
                className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" stroke="#C8A341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                aria-label="Suivant"
                onClick={() => scrollByAmount(destSliderRef.current, 'right')}
                className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="#C8A341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                ref={destSliderRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4"
              >
                {destinations.slice(0, 20).map((d) => (
                  <div
                    key={d.id}
                    className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-[32%]"
                  >
                    <DestinationCard destination={d} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Thèmes Section - header + slider */}
      {travelThemes.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Header style screenshot */}
            <div className="relative mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative h-40 rounded-3xl overflow-hidden bg-gradient-to-r from-yellow-200 via-white to-indigo-200 flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full bg-yellow-300/60 blur-2xl -left-6 top-6" />
                <h2 className="text-3xl md:text-4xl font-bold tracking-wide">LES THÈMES</h2>
                <Link
                  href="/themes"
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 md:static md:translate-x-0 bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors ml-6"
                >
                  Voir tous les thèmes
                </Link>
              </div>
              <div className="relative h-40 md:h-40 rounded-3xl overflow-hidden">
                <Image src="/images/a-la-une-2.jpg" alt="Themes" fill className="object-cover" />
              </div>
            </div>

            {/* Slider */}
            <div className="relative">
              {/* Nav buttons (desktop only) */}
              <button
                aria-label="Précédent"
                onClick={() => scrollByAmount(themeSliderRef.current, 'left')}
                className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" stroke="#C8A341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                aria-label="Suivant"
                onClick={() => scrollByAmount(themeSliderRef.current, 'right')}
                className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="#C8A341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                ref={themeSliderRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4"
              >
                {travelThemes.slice(0, 20).map((t) => (
                  <div
                    key={t.id}
                    className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-[32%]"
                  >
                    <ThemeCard theme={t} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Témoignages Section */}
      {testimonials.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Left: heading and description */}
              <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-sm overflow-hidden">
                {/* subtle paper effect */}
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-gray-200/40 rounded-full" />
                <div className="relative">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    ILS ONT VOYAGÉ AVEC NOUS _ INSPIREZ-VOUS DE LEURS AVIS
                  </h2>
                  <p className="text-lg text-gray-700">
                    Découvrez comment nos séjours sur mesure ont transformé les voyages de nos clients en aventures inoubliables.
                    Nous avons conçu des itinéraires personnalisés pour répondre à des besoins spécifiques, qu'il s'agisse de
                    vacances en famille, de voyages romantiques ou d'expéditions culturelles.
                  </p>
                </div>
              </div>

              {/* Right: image background with bubble card */}
              <div className="relative rounded-3xl overflow-hidden min-h-[360px]">
                <Image src={testimonials[testimonialIndex]?.image_url || '/images/a-la-une-4.jpg'} alt="Témoignages" fill className="object-cover" />

                {/* speech bubble card */}
                <div className="absolute bottom-6 left-6 right-6 md:right-10 md:left-auto max-w-xl bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-xl font-semibold mb-2">{testimonials[testimonialIndex]?.client_name}</div>
                  <div className="text-gray-500 text-3xl leading-none">“</div>
                  <p className="text-gray-700 mt-2">
                    {testimonials[testimonialIndex]?.testimonial_text}
                  </p>
                  <div className="text-gray-500 text-3xl leading-none text-right">”</div>
                </div>

                {/* Nav buttons */}
                <button
                  aria-label="Témoignage précédent"
                  onClick={prevTestimonial}
                  className="hidden md:flex items-center justify-center absolute left-4 bottom-6 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" stroke="#C8A341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  aria-label="Témoignage suivant"
                  onClick={nextTestimonial}
                  className="hidden md:flex items-center justify-center absolute left-24 bottom-6 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" stroke="#C8A341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

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

