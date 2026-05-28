"use client";

import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { TravelType } from "@/types";
import { useRef, useEffect, useState } from "react";
import { useProfessional } from "@/contexts/ProfessionalContext";
import { X } from "lucide-react";

interface TravelTypesProps {
  travelTypes: TravelType[];
  onShowAuthModal?: () => void;
}

function TravelTypesContent({ travelTypes, onShowAuthModal }: TravelTypesProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showProModal, setShowProModal] = useState(false);
  const { session } = useProfessional();

  useEffect(() => {
    const interval = setInterval(() => {
      const el = sliderRef.current;
      if (!el) return;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if (isAtEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  
  if (!travelTypes || travelTypes.length === 0) {
    return null;
  }

  const scrollByAmount = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.8;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };


  return (
    <div className="relative">
      {/* Nav buttons (desktop only) */}
      <button
        aria-label="Précédent"
        onClick={() => scrollByAmount("left")}
        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="#C8A341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        aria-label="Suivant"
        onClick={() => scrollByAmount("right")}
        className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-16 rounded-2xl bg-white shadow-md hover:bg-gray-50 border"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="#C8A341" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mr-4 px-4"
        style={{ scrollbarWidth: "none" }}
      >
        {travelTypes.map((travelType) => (
          <div
            key={travelType.id}
            className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-[32%]"
          >
            <div className="relative bg-cover bg-center h-[420px] rounded-lg overflow-hidden group cursor-pointer">
              {/* Badge Pro incliné */}
              {travelType.is_pro && (
                <div className="absolute top-4 right-[-35px] z-10 bg-black text-white text-xs font-bold py-1 px-10 rotate-45 shadow-lg">
                  PRO
                </div>
              )}
              {travelType.image_url ? (
                <OptimizedImage
                  src={travelType.image_url}
                  alt={travelType.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/destination_fond.png";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🌍</div>
                    <p className="text-base">Image à venir</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50"></div>
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <div>
                  <h3 className="text-2xl font-bold mb-4 font-[Alro] uppercase">{travelType.title}</h3>
                  {travelType.short_description && (
                    <p className="text-base leading-relaxed">
                      {travelType.short_description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  {travelType.is_pro && !session?.isAuthenticated ? (
                    <button
                      onClick={() => setShowProModal(true)}
                      className="bg-[#d9a900] text-white text-base px-6 py-3 rounded font-semibold transition-colors hover:bg-[#c49800]"
                    >
                      Explorer
                    </button>
                  ) : (
                    <Link
                      href={`/type-de-voyage/${travelType.slug}`}
                      className="bg-[#d9a900] text-white text-base px-6 py-3 rounded font-semibold transition-colors hover:bg-[#c49800]"
                    >
                      Explorer
                    </Link>
                  )}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center ripple-container"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Pro - Accès réservé aux professionnels */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-black px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#FFFF00] font-[Alro] uppercase">Accès Professionnel</h2>
                <p className="text-white/70 text-sm mt-1">Réservé aux agents de voyage</p>
              </div>
              <button
                onClick={() => setShowProModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="h-1 bg-[#FFFF00]" />

            {/* Body */}
            <div className="p-8 text-center space-y-6">
              <div className="text-5xl">🔒</div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Contenu Professionnel</h3>
                <p className="text-gray-600 text-sm">
                  Cette offre est réservée aux agents de voyage professionnels. Veuillez vous connecter à votre espace pour y accéder.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowProModal(false);
                    onShowAuthModal?.();
                  }}
                  className="w-full bg-black hover:bg-gray-900 text-[#FFFF00] font-bold py-3 rounded-lg transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => setShowProModal(false)}
                  className="w-full text-gray-600 hover:text-gray-900 font-medium py-3"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TravelTypesContent;
