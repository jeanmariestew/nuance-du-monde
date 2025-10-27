import Image from "next/image";
import Link from "next/link";
import { generateMetadata as getMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OfferImage {
  id?: number;
  image_url: string;
  image_type: "main" | "gallery" | "banner";
  alt_text: string;
  sort_order: number;
}

interface OfferDetail {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  short_description?: string;
  description?: string;
  image_main?: string;
  image_banner?: string;
  image_url?: string;
  banner_image_url?: string;
  images?: OfferImage[];
  price?: number;
  price_currency?: string;
  promotional_price?: number;
  promotional_price_currency?: string;
  promotion_start_date?: string;
  promotion_end_date?: string;
  promotion_description?: string;
  price_includes?: string;
  price_excludes?: string;
  label?: string;
  duration_days?: number;
  duration_nights?: number;
  available_dates?: string[];
  travel_types?: Array<{ id: number; title: string; slug: string }>;
  travel_themes?: Array<{ id: number; title: string; slug: string }>;
  destinations?: Array<{ id: number; title: string; slug: string }>;
  dates?: Array<{ id: number; departure_date: string; return_date?: string }>;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return await getMetadata("offer", slug);
}

async function getOffer(slug: string): Promise<OfferDetail | null> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/offers/${slug}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Erreur lors du chargement de l'offre:", error);
    return null;
  }
}

export default async function OfferDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const offer = await getOffer(slug);

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Offre non trouvée
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Cette offre n&apos;existe pas ou n&apos;est plus disponible.
          </p>
          <Link
            href="/offers"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative p-3 sm:p-6 h-auto md:h-96 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">
        <div className="inset-0 order-1 md:order-1">
          {offer.banner_image_url ||
          offer.image_banner ||
          offer.image_url ||
          offer.image_main ||
          offer.images?.[0].image_url ? (
            <Image
              src={
                offer.banner_image_url ||
                offer.image_banner ||
                offer.image_url ||
                offer.image_main ||
                offer.images?.[0].image_url ||
                ""
              }
              width={200}
              height={200}
              className="w-full h-48 sm:h-64 md:h-96 rounded-2xl object-cover"
              alt={offer.title}
            />
          ) : (
            <div className="w-full h-48 sm:h-64 md:h-96 bg-gradient-to-r from-yellow-600/50 to-yellow-900/50 rounded-2xl" />
          )}
        </div>
        <div className="z-10 gap-6 md:gap-12 text-left text-black p-3 sm:p-6 order-2 md:order-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-yellow-500 font-[Alro] mb-4 md:mb-2">
            {offer.title}
          </h1>
          <div className="flex items-start gap-4 mb-5">
            <div className="flex-shrink-0 mt-1">
              <img
                src="/images/moving.map.png"
                alt=""
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
              />
            </div>
            <div>
              <p className="text-gray-800 font-semibold text-sm sm:text-base leading-relaxed">
                {offer.label}
              </p>
              {offer.duration_days && (
                <p className="text-gray-700 font-semibold text-sm sm:text-base">
                  {offer.duration_days} jours et {offer.duration_nights} nuits
                </p>
              )}
            </div>
          </div>
          <p className="text-sm sm:text-base font-semibold mb-5">{offer.short_description}</p>
          <div className="border border-gray-400 rounded-2xl p-4 sm:p-6 my-6">
            {/* Prix */}
            {(offer.promotional_price || offer.price) &&
              offer.price_currency && (
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row font-semibold items-start sm:items-baseline gap-2 sm:gap-3">
                    <span className="text-sm sm:text-base text-gray-600">À partir de</span>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-yellow-500">
                      {offer.price_currency}{" "}
                      {(offer.promotional_price || offer.price)?.toLocaleString(
                        "fr-FR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                    <span className="text-sm sm:text-base text-gray-600">/ personnes</span>
                  </div>
                </div>
              )}

            {/* Dates */}
            {offer.available_dates && offer.available_dates.length > 0 && (
              <div>
                <div className="text-sm sm:text-base font-medium text-gray-800 mb-3">
                  <strong>Départs garantis du :</strong>
                </div>
                <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                  {new Date(offer.available_dates[0]).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}{" "}
                  au{" "}
                  {new Date(
                    offer.available_dates[offer.available_dates.length - 1]
                  ).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 md:py-20 mx-auto px-6 sm:px-10 md:px-24 mt-10 sm:mt-16 md:mt-24">
        <Accordion type="multiple" className="w-full">
          {offer.description && (
            <AccordionItem value="description">
              <AccordionTrigger className="text-xl sm:text-2xl font-semibold">
                Détails de l&apos;offre
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-700 text-base sm:text-lg">
                  {offer.description?.split("\n").map((line, index) => {
                    const isJourLine = /^Jour\s+\d+/i.test(line.trim());
                    return (
                      <div
                        key={index}
                        className={
                          isJourLine
                            ? "font-bold text-yellow-600 text-base sm:text-lg mb-3 mt-3"
                            : ""
                        }
                      >
                        {line || "\u00A0"}
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {offer.price_includes && (
            <AccordionItem value="includes">
              <AccordionTrigger className="text-xl sm:text-2xl font-semibold text-green-700">
                Nos tarifs comprennent
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line bg-green-50 p-4 sm:p-6 rounded-lg border-l-4 border-green-500">
                  {offer.price_includes}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {offer.price_excludes && (
            <AccordionItem value="excludes">
              <AccordionTrigger className="text-xl sm:text-2xl font-semibold text-red-700">
                Nos tarifs ne comprennent pas
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line bg-red-50 p-4 sm:p-6 rounded-lg border-l-4 border-red-500">
                  {offer.price_excludes}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </section>
    </div>
  );
}
