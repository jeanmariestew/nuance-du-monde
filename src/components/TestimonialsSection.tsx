"use client";

import { Quote } from "lucide-react";
import Image from "next/image";
import { useRef, useEffect } from "react";

interface Testimonial {
  id: number;
  client_name: string;
  testimonial_text: string;
  image_url?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (
    element: HTMLDivElement | null,
    direction: "left" | "right"
  ) => {
    if (!element) return;
    const scrollAmount = element.clientWidth * 0.8;
    element.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Auto-scroll slider
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const container = sliderRef.current;
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

        scrollByAmount(container, "right");
      }, 4000); // 4 secondes entre chaque slide
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    start();

    // Pause on hover
    container.addEventListener("mouseenter", stop);
    container.addEventListener("mouseleave", start);

    return () => {
      stop();
      if (container) {
        container.removeEventListener("mouseenter", stop);
        container.removeEventListener("mouseleave", start);
      }
    };
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="">
      <div className="relative h-full overflow-hidden flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-5 items-stretch">
          {/* Left: heading and description */}
          <div className="relative p-8 md:p-10 shadow-sm overflow-hidden col-span-2">
            <Image
              src="/images/fond2.jpg"
              alt="Background themes"
              fill
              className="object-cover"
            />
            <div className="flex">
              {/* Icône circulaire exacte comme la capture */}
              <div className=" top-0 left-8 w-16 h-16 bg-black/20 rounded-full flex items-center justify-center ripple-container">
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="ripple-wave"></div>
                <div className="w-4 h-4 bg-black rounded-full pulse-animation"></div>
              </div>
              <Image
                src="/images/map2.svg"
                alt="Background themes"
                width={100}
                height={100}
                className="w-40 h-auto"
              />
            </div>
            {/* subtle paper effect */}
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-gray-200/40 rounded-full" />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-6 font-[Alro]">
                ILS ONT VOYAGÉ AVEC NOUS _ INSPIREZ-VOUS DE LEURS AVIS
              </h2>
              <p className="text-sm text-gray-700">
                Découvrez comment nos séjours sur mesure ont transformé les
                voyages de nos clients en aventures inoubliables. Nous avons
                conçu des itinéraires personnalisés pour répondre à des besoins
                spécifiques, qu&apos;il s&apos;agisse de vacances en famille, de
                voyages romantiques ou d&apos;expéditions culturelles.
              </p>
            </div>
          </div>

          {/* Right: Testimonials Slider */}
          <div className="relative overflow-hidden col-span-3">
            {/* Nav buttons */}
            <button
              aria-label="Témoignage précédent"
              onClick={() => scrollByAmount(sliderRef.current, "left")}
              className="hidden md:flex items-center justify-center absolute left-4 bottom-0 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50"
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
              onClick={() => scrollByAmount(sliderRef.current, "right")}
              className="hidden md:flex items-center justify-center absolute left-28 bottom-0 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50"
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

            {/* Slider Container */}
            <div
              ref={sliderRef}
              className="flex gap-0 overflow-x-auto snap-x snap-mandatory scroll-smooth h-full"
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="snap-start shrink-0 w-full relative overflow-hidden"
                >
                  <Image
                    src={
                      testimonial.image_url || `/images/slider${index % 3}.jpg`
                    }
                    alt={`Témoignage de ${testimonial.client_name}`}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Testimonial content */}
                  <div className="absolute bottom-6  max-w-sm right-6 text-black">
                    <div className="bg-white rounded-2xl p-6 border border-white/20">
                      <p className="font-semibold text-lg mb-2 text-black">
                        {testimonial.client_name}
                      </p>
                      <div className="flex items-start gap-3 mb-4">
                        <Quote
                          className="text-yellow-400 flex-shrink-0 mt-1"
                          size={20}
                        />
                        <p className="text-black text-sm leading-relaxed">
                          {testimonial.testimonial_text}
                        </p>
                        <Quote
                          className="text-yellow-400 flex-shrink-0 mt-1 rotate-180"
                          size={20}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
