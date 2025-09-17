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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Offre non trouvée
          </h1>
          <p className="text-gray-600 mb-8">
            Cette offre n&apos;existe pas ou n&apos;est plus disponible.
          </p>
          <Link
            href="/offers"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative p-5 h-80 grid grid-cols-1 md:grid-cols-2 ">
        <div className="inset-0">
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
              className="w-full h-96 rounded-2xl"
              alt={offer.title}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-yellow-600/50 to-yellow-900/50" />
          )}
        </div>
        <div className="z-10 gap-10 text-left text-black p-4">
          <h1 className="text-3xl font-medium text-yellow-500 font-[Alro]">
            {offer.title}
          </h1>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 mt-1">
              <img
                src="/images/moving.map.png"
                alt=""
                className="w-5 h-5 text-gray-600"
              />
            </div>
            <div>
              <p className="text-gray-800 font-semibold text-xs leading-relaxed">
                {offer.label}
              </p>
              {offer.duration_days && (
                <p className="text-gray-700 font-semibold text-xs">
                  {offer.duration_days} jours et {offer.duration_nights} nuits
                </p>
              )}
            </div>
          </div>
          <p className="text-sm font-semibold">{offer.short_description}</p>
          <div className=" border border-gray-400 rounded-2xl p-4 my-5">
            {/* Prix */}
            {(offer.promotional_price || offer.price) &&
              offer.price_currency && (
                <div className="mb-4">
                  <div className="flex font-semibold items-baseline gap-2">
                    <span className="text-sm text-gray-600">À partir de</span>
                    <span className="text-3xl font-semibold text-yellow-500">
                      {offer.price_currency}{" "}
                      {(offer.promotional_price || offer.price)?.toLocaleString(
                        "fr-FR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                    <span className="text-sm text-gray-600">/ personnes</span>
                  </div>
                </div>
              )}

            {/* Dates */}
            {offer.available_dates && offer.available_dates.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-800 mb-2">
                  <strong>Départs garantis du :</strong>
                </div>
                <div className="text-lg font-semibold text-gray-900">
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

      <section className="py-16 mx-auto px-20 mt-20">
        <Accordion type="multiple" className="w-full">
          {offer.description && (
            <AccordionItem value="description">
              <AccordionTrigger className="text-xl font-semibold">
                Détails de l'offre
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-700 ">
                  {offer.description?.split("\n").map((line, index) => {
                    const isJourLine = /^Jour\s+\d+/i.test(line.trim());
                    return (
                      <div
                        key={index}
                        className={
                          isJourLine
                            ? "font-bold text-yellow-600 text-ms mb-2 mt-2"
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
              <AccordionTrigger className="text-xl font-semibold text-green-700">
                Nos tarifs comprennent
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  {offer.price_includes}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {offer.price_excludes && (
            <AccordionItem value="excludes">
              <AccordionTrigger className="text-xl font-semibold text-red-700">
                Nos tarifs ne comprennent pas
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
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
