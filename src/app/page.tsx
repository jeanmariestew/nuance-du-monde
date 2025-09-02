"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import HeroAnimated from "@/components/HeroAnimated";
import TravelTypesHero from "@/components/TravelTypesHero";
import TravelTypesSection from "@/components/TravelTypesSection";
import { Destination, TravelType, TravelTheme, Testimonial, Partner } from "@/types";
import DestinationCard from "@/components/cards/DestinationCard";
import ThemeCard from "@/components/cards/ThemeCard";
import { SLIDER_INTERVAL_MS } from "@/lib/ui";

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [travelThemes, setTravelThemes] = useState<TravelTheme[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const destSliderRef = useRef<HTMLDivElement>(null);
  const themeSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Charger les données depuis l'API
    const fetchData = async () => {
      try {
        const [destRes, typesRes, themesRes, testimonialsRes, partnersRes] =
          await Promise.all([
            fetch("/api/destinations?active=true&limit=20"),
            fetch("/api/travel-types?active=true"),
            fetch("/api/travel-themes?active=true&limit=20"),
            fetch(
              "/api/testimonials?featured=true&active=true&published=true&limit=6"
            ),
            fetch("/api/partners"),
          ]);

        const [destData, typesData, themesData, testimonialsData, partnersData] =
          await Promise.all([
            destRes.json(),
            typesRes.json(),
            themesRes.json(),
            testimonialsRes.json(),
            partnersRes.json(),
          ]);

        if (destData.success) setDestinations(destData.data);
        if (typesData.success) setTravelTypes(typesData.data);
        if (themesData.success) setTravelThemes(themesData.data);
        if (testimonialsData.success) setTestimonials(testimonialsData.data);
        if (partnersData.success) setPartners(partnersData.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
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
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 8;
        if (nearEnd) {
          container.scrollTo({ left: 0, behavior: "smooth" });
          return;
        }
        const step = getSingleCardStep(container);
        container.scrollBy({ left: step, behavior: "smooth" });
      }, SLIDER_INTERVAL_MS);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    start();
    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);
    return () => {
      stop();
      container.removeEventListener("mouseenter", stop);
      container.removeEventListener("mouseleave", start);
    };
  }, [destinations.length]);

  // Auto-scroll themes slider
  useEffect(() => {
    const container = themeSliderRef.current;
    if (!container) return;

    let timer: NodeJS.Timeout | null = null;
    const start = () => {
      stop();
      timer = setInterval(() => {
        if (!container) return;
        const nearEnd =
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 8;
        if (nearEnd) {
          container.scrollTo({ left: 0, behavior: "smooth" });
          return;
        }
        const step = getSingleCardStep(container);
        container.scrollBy({ left: step, behavior: "smooth" });
      }, SLIDER_INTERVAL_MS);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    start();
    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);
    return () => {
      stop();
      container.removeEventListener("mouseenter", stop);
      container.removeEventListener("mouseleave", start);
    };
  }, [travelThemes.length]);

  // Helpers for nav buttons
  const getSingleCardStep = (el: HTMLDivElement) => {
    // step = 1 card width + gap (gap-6 = 24px)
    const gapPx = 24;
    const first = el.querySelector<HTMLElement>(":scope > *");
    if (!first) return Math.max(320, Math.floor(el.clientWidth * 0.8));
    return Math.ceil(first.offsetWidth + gapPx);
  };

  const scrollByAmount = (el: HTMLDivElement | null, dir: "left" | "right") => {
    if (!el) return;
    const step = getSingleCardStep(el);
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
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
    setTestimonialIndex(
      (i) => (i - 1 + testimonials.length) % testimonials.length
    );
  };
  const nextTestimonial = () => {
    if (!testimonials.length) return;
    setTestimonialIndex((i) => (i + 1) % testimonials.length);
  };

  return (
    <div className="flex flex-col gap-y-10">
      {/* Hero animé */}
      <HeroAnimated />

      {/* Type de voyage Section - Intégration parfaite */}
      <TravelTypesHero />

      {/* Section Types de voyage */}
      <TravelTypesSection travelTypes={travelTypes} />

      {/* Destinations Section - Nouveau design */}
      <section className="relative text-white overflow-hidden">
        <div className="w-full h-full">
          <div className="grid grid-rows-2 relative sm:grid-rows-1 sm:grid-cols-2 gap-0 h-full">
            <div>
              {/* Colonne droite - Image pleine hauteur */}
              <div className="relative h-full">
                <Image
                  src="/images/a-la-une-1-1.webp"
                  alt="Destinations - Personnes qui trinquent"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <Image
                src={"/images/plane.png"}
                className="absolute right-10 top-10 z-10 w-40"
                alt=""
                width={200}
                height={200}
              />
              {/* Colonne droite - Animations */}
              <div className="relative h-full flex items-center justify-center">
                {/* Point jaune avec animation */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center ripple-container">
                  <div className="ripple-wave"></div>
                  <div className="ripple-wave"></div>
                  <div className="ripple-wave"></div>
                  <div className="w-4 h-4 bg-[#d9a900] rounded-full pulse-animation"></div>
                </div>

                {/* Trajectoire en pointillés */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 400"
                >
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
                  <svg
                    className="airplane"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Colonne gauche - Texte avec fond texturé */}
            <div className="relative flex flex-col justify-center px-8 lg:px-16">
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src="/images/texture.png"
                  alt=""
                  fill
                  className="object-cover mix-blend-overlay"
                  priority
                />
              </div>
              {/* Icône circulaire exacte comme la capture */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center ripple-container">
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="w-4 h-4 bg-[#d9a900] rounded-full pulse-animation"></div>
              </div>

              <div className="mt-16">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white tracking-wide">
                  LES DESTINATIONS
                </h2>
                <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-md">
                  Voyagez au cœur des plus belles destinations du monde à
                  travers des itinéraires captivants et soigneusement conçus
                  pour vous.
                </p>
                <Link
                  href="/destinations"
                  className="bg-[#d9a900] text-white px-6 py-3 rounded font-semibold hover:bg-yellow-300 transition-colors inline-block mt-8"
                >
                  Voir toutes les destinations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Destinations - Slider auto */}
      {destinations.length > 0 && (
        <section className="">
          <div className="mx-auto px-4">
            <div className="relative">
              {/* Nav buttons (desktop only) */}
              <button
                aria-label="Précédent"
                onClick={() => scrollByAmount(destSliderRef.current, "left")}
                className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="#C8A341"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                aria-label="Suivant"
                onClick={() => scrollByAmount(destSliderRef.current, "right")}
                className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="#C8A341"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
        <section className=" bg-gray-50">
          <div className=" mx-auto">
            {/* Header style screenshot */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="relative h-full overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/fond_theme.png"
                  alt="Background themes"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 " />
                <div className="relative min-h-80 z-10 flex items-center justify-center w-full">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-black">
                    LES THÈMES
                  </h2>
                  <Link
                    href="/themes"
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 md:static md:translate-x-0 bg-yellow-500 rounded-lg text-white px-6 py-3 font-semibold hover:bg-[#d9a900] transition-colors ml-6"
                  >
                    Voir tous les thèmes
                  </Link>
                </div>
              </div>
              <div className="relative min-h-80 overflow-hidden">
                <Image
                  src="/images/a-la-une-2-1.png"
                  alt="Themes"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}
      <section>
        {/* Slider */}
        <div className="relative">
          {/* Nav buttons (desktop only) */}
          <button
            aria-label="Précédent"
            onClick={() => scrollByAmount(themeSliderRef.current, "left")}
            className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 6l-6 6 6 6"
                stroke="#C8A341"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            aria-label="Suivant"
            onClick={() => scrollByAmount(themeSliderRef.current, "right")}
            className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="#C8A341"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
      </section>
      
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
                    Découvrez comment nos séjours sur mesure ont transformé les
                    voyages de nos clients en aventures inoubliables. Nous avons
                    conçu des itinéraires personnalisés pour répondre à des
                    besoins spécifiques, qu&apos;il s&apos;agisse de vacances en
                    famille, de voyages romantiques ou d&apos;expéditions
                    culturelles.
                  </p>
                </div>
              </div>

              {/* Right: image background with bubble card */}
              <div className="relative rounded-3xl overflow-hidden min-h-[360px]">
                <Image
                  src={
                    testimonials[testimonialIndex]?.image_url ||
                    "/images/a-la-une-4.jpg"
                  }
                  alt="Témoignages"
                  fill
                  className="object-cover"
                />

                {/* speech bubble card */}
                <div className="absolute bottom-6 left-6 right-6 md:right-10 md:left-auto max-w-xl bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-xl font-semibold mb-2">
                    {testimonials[testimonialIndex]?.client_name}
                  </div>
                  <div className="text-gray-500 text-3xl leading-none">“</div>
                  <p className="text-gray-700 mt-2">
                    {testimonials[testimonialIndex]?.testimonial_text}
                  </p>
                  <div className="text-gray-500 text-3xl leading-none text-right">
                    ”
                  </div>
                </div>

                {/* Nav buttons */}
                <button
                  aria-label="Témoignage précédent"
                  onClick={prevTestimonial}
                  className="hidden md:flex items-center justify-center absolute left-4 bottom-6 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M15 6l-6 6 6 6"
                      stroke="#C8A341"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  aria-label="Témoignage suivant"
                  onClick={nextTestimonial}
                  className="hidden md:flex items-center justify-center absolute left-24 bottom-6 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="#C8A341"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Partenaires Section */}
      <section className="py-16 bg-gray-100 relative">
        {/* Background pattern similar to screenshot */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-yellow-300/30"></div>
          <div className="absolute top-32 right-20 w-24 h-24 rounded-full bg-yellow-400/20"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-yellow-500/25"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 rounded-full bg-yellow-300/15"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-600 uppercase tracking-wide">
            NOS PARTENAIRES AGENCES DE VOYAGE
          </h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            Nuance du Monde collabore avec des agences de voyage dévouées qui se
            distinguent par leur engagement envers l&apos;excellence. Ensemble,
            nous créons des expériences de voyage à la carte et riches, alliant
            passion et expertise pour offrir à nos clients des aventures
            uniques.
          </p>

          <div className="grid grid-cols-1  md:grid-cols-4 gap-6 mx-auto">
            {partners.map((partner, index) => (
              <Link key={partner.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" href={partner.website_url || ''}>
                <div className="p-1">
                  <div className="relative w-full h-36 mx-auto mb-4">
                    {partner.image_url ? (
                      <Image
                        src={partner.image_url}
                        alt={partner.name}
                        fill
                        className=" rounded-2xl object-cover"
                      />
                    ) : (
                      <Image
                        src={'/images/unnamed.png'}
                        alt={partner.name}
                        fill
                        className=" object-cover"
                      />
                      
                    )}

                  </div>
                  <h4 className="font-bold text-lg text-yellow-600 mb-1">{partner.name}</h4>
                  <p className="text-sm text-gray-600 font-medium">{partner.agency}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <NewsletterForm /> */}
    </div>
  );
}
