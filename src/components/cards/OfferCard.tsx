"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Offer } from "@/types";

type Props = { offer: Offer };

/** symbole monétaire simple (la capture montre "$ …") */
function formatPrice(value?: number) {
  if (value == null) return "—";
  // "3.990,00" (séparateur milliers ".", décimal ",")
  const formatted = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `$ ${formatted}`;
}

function buildDuration(offer: Offer) {
  if (offer.duration_days || offer.duration_nights) {
    const j = offer.duration_days ? `${offer.duration_days} jours` : "";
    const n = offer.duration_nights ? `${offer.duration_nights} nuits` : "";
    return [j, n].filter(Boolean).join(" et ");
  }
  return offer.duration?.trim();
}

/** petit mapping pour afficher un gentilé FR proche de la capture (fallback = destination) */
function toDemonymFR(dest?: string) {
  if (!dest) return undefined;
  const map: Record<string, string> = {
    Maroc: "Marocain",
    "Égypte": "Égyptien",
    Egypte: "Égyptien",
    Kenya: "Kényan",
    "Afrique du Sud": "Sud-Africain",
    Colombie: "Colombien",
    Pérou: "Péruvien",
    "États-Unis": "Américain",
    USA: "Américain",
    Argentine: "Argentin",
    Thaïlande: "Thaïlandais",
  };
  return map[dest] || dest;
}

export default function OfferCard({ offer }: Props) {
  // image côté gauche (priorité bannière > image)
  const img =
    offer.banner_image_url ||
    (offer as any).image_banner ||
    offer.image_url ||
    (offer as any).image_main;

  // Titre principal = 1ʳᵉ destination sinon titre d’offre
  const primaryDestination =
    (offer.destinations && offer.destinations[0]?.title) || undefined;
  const cardTitle = primaryDestination || offer.title;

  const subtitle =
    offer.subtitle?.trim() || offer.short_description?.trim() || undefined;

  const durationText = buildDuration(offer);

  // Overlay dans l’image
  const firstType = offer.travel_types?.[0]?.title;
  const overlayLines = [firstType, primaryDestination, offer.slug]
    .filter(Boolean) as string[];

  const priceValue = offer.price_from ?? (offer as any).price;
  const priceText = formatPrice(priceValue);
  const demonym = toDemonymFR(primaryDestination);

  return (
    <Link
      href={`/offers/${offer.slug}`}
      className="group block rounded-[28px] border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* ===== Image à gauche ===== */}
        <div className="relative md:w-[42%] h-64 md:h-64">
          {img ? (
            <Image src={img} alt={offer.title} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}

          {/* dégradé bas pour lisibilité */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />

          {/* overlay 3 lignes (type / destination / slug) */}
          {overlayLines.length > 0 && (
            <div className="absolute bottom-3 left-3 space-y-1">
              {overlayLines.map((line, i) => (
                <div
                  key={i}
                  className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)] text-[15px] md:text-base font-semibold"
                >
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== Contenu + Prix à droite ===== */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:gap-8">
            {/* Bloc titre + infos */}
            <div className="flex-1">
              <h3 className="text-[30px] leading-tight md:text-[36px] font-semibold text-[#c8a341] mb-2">
                {cardTitle}
              </h3>

              <div className="space-y-2 text-gray-800">
                {subtitle && (
                  <div className="text-[17px] md:text-lg">{subtitle}</div>
                )}

                {demonym && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-5 w-5" />
                    <span className="text-[16px]">{demonym}</span>
                  </div>
                )}

                {durationText && (
                  <div className="text-[17px] md:text-lg">{durationText}</div>
                )}
              </div>
            </div>

            {/* Boîte prix (à droite) */}
            <div className="mt-6 md:mt-0 md:w-[320px] flex-shrink-0">
              <div className="rounded-2xl border border-sky-300 ring-1 ring-sky-100 shadow-[0_10px_28px_rgba(56,189,248,0.15)] p-6">
                <div className="text-sm text-gray-700 mb-2">À partir de</div>
                <div className="text-[30px] md:text-[34px] font-extrabold text-yellow-600 tracking-tight">
                  {priceText}
                </div>
                <div className="text-sm text-gray-700 mt-2">/ personne</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
