"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  agency: string;
  image_url?: string;
  website_url?: string;
}

interface PartnersSectionProps {
  partners: Partner[];
}

function useVisibleCount() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setCount(width < 640 ? 1 : width < 1024 ? 2 : 4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  const visible = useVisibleCount();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = partners?.length ?? 0;
  const maxIndex = Math.max(0, total - visible);

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (paused || total <= visible) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 4500);
    return () => window.clearInterval(timer);
  }, [paused, total, visible, maxIndex]);

  if (total === 0) return null;

  const goTo = (next: number) => {
    if (next < 0) setIndex(maxIndex);
    else if (next > maxIndex) setIndex(0);
    else setIndex(next);
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-yellow-50 via-orange-50 to-yellow-100 py-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-96 w-96 rounded-full bg-yellow-400 blur-3xl"></div>
        <div className="absolute right-10 bottom-10 h-[500px] w-[500px] rounded-full bg-orange-400 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center">
        <div className="mb-12">
          <h2 className="mb-6 font-[Alro] text-4xl font-bold tracking-wide text-[#d9a900] uppercase drop-shadow-sm md:text-5xl">
            NOS PARTENAIRES AGENCES DE VOYAGE
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed font-medium text-gray-700 md:text-lg">
            Nuance du Monde collabore avec des agences de voyage dévouées qui se
            distinguent par leur engagement envers l&apos;excellence. Ensemble,
            nous créons des expériences de voyage à la carte et riches, alliant
            passion et expertise pour offrir à nos clients des aventures uniques.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            aria-label="Agences précédentes"
            onClick={() => goTo(index - 1)}
            className="absolute top-1/2 left-0 z-10 -translate-x-1 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-all hover:border-yellow-400 hover:bg-yellow-50 sm:-translate-x-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Agences suivantes"
            onClick={() => goTo(index + 1)}
            className="absolute top-1/2 right-0 z-10 translate-x-1 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-all hover:border-yellow-400 hover:bg-yellow-50 sm:translate-x-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="overflow-hidden px-8 sm:px-2">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * (100 / visible)}%)` }}
            >
              {partners.map((partner) => {
                const city = partner.agency?.trim();
                const card = (
                  <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-yellow-200/70 bg-white px-4 py-6 shadow-md">
                    <div className="flex h-24 w-full items-center justify-center">
                      {partner.image_url ? (
                        <img
                          src={partner.image_url}
                          alt=""
                          className="max-h-20 max-w-[180px] object-contain"
                        />
                      ) : (
                        <span className="text-3xl" aria-hidden>
                          ✈
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-gray-900 sm:text-base">
                      {partner.name}
                    </h3>
                    {city && city !== partner.name ? (
                      <p className="mt-1 text-xs text-gray-500">{city}</p>
                    ) : null}
                  </div>
                );

                return (
                  <div
                    key={partner.id}
                    className="shrink-0 px-2"
                    style={{ width: `${100 / visible}%` }}
                  >
                    {partner.website_url ? (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                      >
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
