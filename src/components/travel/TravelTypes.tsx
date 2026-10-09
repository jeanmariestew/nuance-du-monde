"use client";

import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { TravelType } from "@/types";
import { useEffect, useState } from "react";
import { useProfessional } from "@/contexts/ProfessionalContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface TravelTypesProps {
  travelTypes: TravelType[];
  onShowAuthModal?: () => void;
  // Si défini : affiche un extrait en grille (2 colonnes) au lieu du carousel
  gridLimit?: number;
}

interface CardProps {
  travelType: TravelType;
  isAuthenticated: boolean;
  onProClick: () => void;
  compact?: boolean;
}

function TravelCard({ travelType, isAuthenticated, onProClick, compact = false }: CardProps) {
  return (
    <div className={`relative bg-cover bg-center rounded-lg overflow-hidden group cursor-pointer ${compact ? "h-[170px] sm:h-[260px] lg:h-[320px]" : "h-[420px]"}`}>
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
      <div className={`absolute inset-0 flex flex-col justify-end text-white ${compact ? "p-2.5 sm:p-4 gap-1 sm:gap-2" : "p-4"}`}>
        <div>
          <h3 className={`font-bold font-[Alro] uppercase ${compact ? "text-base sm:text-xl mb-0.5 sm:mb-1" : "text-2xl mb-4"}`}>{travelType.title}</h3>
          {travelType.short_description && (
            <p className={compact ? "text-xs sm:text-sm leading-snug line-clamp-1 sm:line-clamp-2" : "text-base leading-relaxed"}>{travelType.short_description}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          {travelType.is_pro && !isAuthenticated ? (
            <button
              onClick={onProClick}
              className={`bg-[#d9a900] text-white rounded font-semibold transition-colors hover:bg-[#c49800] ${compact ? "text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2" : "text-base px-6 py-3"}`}
            >
              Explorer
            </button>
          ) : (
            <Link
              href={`/type-de-voyage/${travelType.slug}`}
              className={`bg-[#d9a900] text-white rounded font-semibold transition-colors hover:bg-[#c49800] ${compact ? "text-sm px-4 py-2" : "text-base px-6 py-3"}`}
            >
              Explorer
            </Link>
          )}
          {!compact && <div className="w-12 h-12 rounded-full flex items-center justify-center ripple-container"></div>}
        </div>
      </div>
    </div>
  );
}

function TravelTypesContent({ travelTypes, onShowAuthModal, gridLimit }: TravelTypesProps) {
  const [showProModal, setShowProModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const { session } = useProfessional();
  const isAuthenticated = session?.isAuthenticated ?? false;

  useEffect(() => {
    if (travelTypes.length <= itemsPerPage) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = travelTypes.length - itemsPerPage;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [travelTypes.length]);

  if (!travelTypes || travelTypes.length === 0) return null;

  const cardProps = { isAuthenticated, onProClick: () => setShowProModal(true) };

  return (
    <div className="relative">
      {/* Extrait en grille (page d'accueil) */}
      {gridLimit !== undefined && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-[repeat(2,calc((100%-3rem)/3))] lg:justify-evenly">
          {travelTypes.slice(0, gridLimit).map((travelType) => (
            <TravelCard key={travelType.id} travelType={travelType} {...cardProps} compact />
          ))}
        </div>
      )}

      {/* Mobile : grille 1 colonne */}
      <div className={`grid grid-cols-1 lg:hidden gap-8 ${gridLimit !== undefined ? "hidden" : ""}`}>
        {travelTypes.map((travelType) => (
          <TravelCard key={travelType.id} travelType={travelType} {...cardProps} />
        ))}
      </div>

      {/* Desktop : carousel */}
      <div className={`${gridLimit !== undefined ? "hidden" : "hidden lg:block"} relative`}>
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setCurrentIndex((prev) => Math.min(travelTypes.length - itemsPerPage, prev + 1))}
          disabled={currentIndex >= travelTypes.length - itemsPerPage}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex gap-8 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage + 2)}%)` }}
          >
            {travelTypes.map((travelType) => (
              <div key={travelType.id} className="min-w-[calc(33.333%-1.33rem)] shrink-0">
                <TravelCard travelType={travelType} {...cardProps} />
              </div>
            ))}
          </div>
        </div>

        {travelTypes.length > itemsPerPage && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: travelTypes.length - itemsPerPage + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === i ? "bg-yellow-500 scale-110" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Pro */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-black px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#FFFF00] font-[Alro] uppercase">Accès Professionnel</h2>
                <p className="text-white/70 text-sm mt-1">Réservé aux agents de voyage</p>
              </div>
              <button onClick={() => setShowProModal(false)} className="text-white/60 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="h-1 bg-[#FFFF00]" />
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
                  onClick={() => { setShowProModal(false); onShowAuthModal?.(); }}
                  className="w-full bg-black hover:bg-gray-900 text-[#FFFF00] font-bold py-3 rounded-lg transition-colors"
                >
                  Se connecter
                </button>
                <button onClick={() => setShowProModal(false)} className="w-full text-gray-600 hover:text-gray-900 font-medium py-3">
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
