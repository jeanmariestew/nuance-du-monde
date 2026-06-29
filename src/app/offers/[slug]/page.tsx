import Link from "next/link";
import Script from "next/script";
import { Clock, Tag } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { generateMetadata as getMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import OfferItinerarySection from "@/components/OfferItinerarySection";
import DatesAndPricing from "@/components/DatesAndPricing";
import ImageStackCarousel from "@/components/ImageStackCarousel";
import OfferExtensions from "@/components/OfferExtensions";
import OfferHotels from "@/components/OfferHotels";

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
  programme_link?: string;
  coordinates?: Array<{ name: string; lat: number; lng: number }>;
  map_center?: { lat: number; lng: number; zoom: number } | null;
  map_image?: string;
  day_options?: Array<{
    id: number;
    day_number: number;
    title: string;
    description?: string;
    image_url?: string;
    price_supplement?: number;
    price_currency?: string;
    is_included?: boolean;
  }>;
  extensions?: Array<{
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    duration_days?: number;
    duration_nights?: number;
    price?: number;
    price_currency?: string;
    price_note?: string;
    itinerary?: string;
    images?: Array<{ id?: number; image_url: string; alt_text?: string }>;
  }>;
  hotels?: Array<{
    id: number;
    name: string;
    location?: string;
    description?: string;
    images?: Array<{ id?: number; image_url: string; alt_text?: string }>;
  }>;
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://nuancedumonde.com";

    const url = `${baseUrl}/api/offers/${encodeURIComponent(slug)}`;
    const res = await fetch(url, { cache: "no-store" });

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

  // Image de couverture principale - vérifier toutes les sources possibles
  const coverImage =
    offer.images?.find((img) => img.image_type === "banner")?.image_url ||
    offer.image_banner ||
    offer.banner_image_url ||
    offer.images?.[0]?.image_url ||
    offer.image_main;

  return (
    <div>
      {/* Image de couverture héro - toujours affichée */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full overflow-hidden">
        {coverImage ? (
          <>
            <OptimizedImage
              src={coverImage}
              alt={offer.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          </>
        ) : (
          /* Fond gris si pas d'image */
          <div className="absolute inset-0 bg-gray-200" />
        )}

        {/* Titre superposé */}
        <div className="absolute inset-0 flex items-end">
          <div className="site-container pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-4xl">
              <span
                className={`inline-block px-4 py-2 ${
                  coverImage
                    ? "bg-yellow-500/90 text-white"
                    : "bg-yellow-500 text-white"
                } text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg mb-4`}
              >
                {offer.destinations?.[0]?.title || "Voyage"}
              </span>
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[Alro] uppercase mb-4 ${
                  coverImage ? "text-white drop-shadow-2xl" : "text-gray-800"
                }`}
              >
                {offer.title}
              </h1>
              {offer.subtitle && (
                <p
                  className={`text-lg sm:text-xl lg:text-2xl ${
                    coverImage
                      ? "text-white/95 drop-shadow-lg"
                      : "text-gray-700"
                  }`}
                >
                  {offer.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Header Section avec disposition image 1 */}
      <section className="site-container ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left: Content */}
          <div className="order-2 lg:order-1 px-4 sm:px-0">
            {(offer.duration_days || offer.duration_nights || offer.price) && (
              <div className="flex flex-col gap-2 mt-3 sm:mt-4 mb-4 sm:mb-6">
                {(offer.duration_days || offer.duration_nights) && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span className="text-lg sm:text-xl font-semibold text-gray-900">
                      {offer.duration_days ? `${offer.duration_days} jour${offer.duration_days > 1 ? 's' : ''}` : ''}
                      {offer.duration_days && offer.duration_nights ? ' / ' : ''}
                      {offer.duration_nights ? `${offer.duration_nights} nuit${offer.duration_nights > 1 ? 's' : ''}` : ''}
                    </span>
                  </div>
                )}
                {offer.price && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span className="text-base font-bold sm:text-lg text-gray-600">
                      À partir de{" "}
                      <strong className="text-yellow-600">
                        {offer.price.toLocaleString("fr-FR")}{" "}{offer.price_currency || "CAD"}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="prose prose-base sm:prose-lg max-w-[450px] text-gray-700 leading-relaxed mb-6 sm:mb-8">
              {offer.short_description && (() => {
                const text = offer.short_description;
                
                // Cherche "NOS EXPÉRIENCES +" au début ou après du texte
                const experiencesMatch = text.match(/NOS EXPÉRIENCES \+\s*:?\s*([\s\S]*)/i);
                
                // Vérifie quel séparateur est utilisé
                const hasDotSeparator = text.includes('. ');
                const hasBulletSeparator = text.includes('·');
                
                // Fonction pour splitter selon le séparateur détecté
                const splitContent = (content: string) => {
                  if (content.includes('·')) {
                    // Séparateur · (point médian)
                    return content.split('·').map(item => item.trim()).filter(item => item.length > 0);
                  } else if (content.includes('. ')) {
                    // Séparateur ". " (point + espace)
                    return content.split('. ').map(item => item.trim()).filter(item => item.length > 0);
                  }
                  return [content.trim()].filter(item => item.length > 0);
                };
                
                // Format 1 & 2: Commence par "NOS EXPÉRIENCES +"
                if (experiencesMatch) {
                  const beforeExperiences = text.substring(0, experiencesMatch.index).trim();
                  const experiencesContent = experiencesMatch[1];
                  const bulletPoints = splitContent(experiencesContent);
                  
                  return (
                    <>
                      {beforeExperiences && (
                        <p className="text-sm sm:text-base mb-3">{beforeExperiences}</p>
                      )}
                      <p className="text-sm sm:text-base font-bold text-gray-900 mb-2">NOS EXPÉRIENCES +</p>
                      <ul className="list-none space-y-1 text-sm sm:text-base pl-0 m-0">
                        {bulletPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-yellow-500 shrink-0">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                }
                
                // Format 3: Intro + séparateurs (sans "NOS EXPÉRIENCES +")
                if (hasBulletSeparator || hasDotSeparator) {
                  const parts = splitContent(text);
                  
                  // Le premier élément est l'intro, les suivants sont les points
                  const intro = parts[0];
                  const points = parts.slice(1);
                  
                  return (
                    <>
                      {intro && (
                        <p className="text-sm sm:text-base font-bold text-gray-900 mb-2">{intro}</p>
                      )}
                      {points.length > 0 && (
                        <ul className="list-none space-y-1 text-sm sm:text-base pl-0 m-0">
                          {points.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 leading-relaxed">
                              <span className="text-yellow-500 shrink-0">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  );
                }
                
                // Texte simple sans formatage spécial
                return <p className="text-sm sm:text-base">{text}</p>;
              })()}
            </div>
            <Link
              href={`/devis-personnalise?circuit=${encodeURIComponent(offer.title)}`}
              className="inline-block w-full sm:w-auto bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl hover:scale-105 text-center"
            >
              Demander un devis
            </Link>
          </div>

          {/* Right: Stacked Images Carousel */}
          <div className="order-1 lg:order-2 relative">
            <ImageStackCarousel
              images={offer.images || []}
              fallbackImage={
                offer.banner_image_url ||
                offer.image_banner ||
                offer.image_url ||
                offer.image_main
              }
              title={offer.title}
            />
          </div>
        </div>
      </section>

      {/* Section Itinéraire avec carte et timeline */}
      <OfferItinerarySection
        description={offer.description}
        destinations={offer.destinations}
        title="Itinéraire détaillé"
        programmeLink={offer.programme_link}
        coordinates={offer.coordinates}
        mapCenter={offer.map_center}
        mapImage={offer.map_image}
        dayOptions={offer.day_options}
      />

      {/* Section Dates et Prix */}
      <DatesAndPricing
        dates={offer.dates}
        basePrice={offer.price}
        baseCurrency={offer.price_currency}
      />

      {/* Section Hôtels */}
      {offer.hotels && offer.hotels.length > 0 && (
        <OfferHotels hotels={offer.hotels} />
      )}

      {/* Section Extensions */}
      {offer.extensions && offer.extensions.length > 0 && (
        <OfferExtensions extensions={offer.extensions} />
      )}

      <section className="site-container site-section">
        <Accordion type="multiple" className="w-full space-y-4">
          {offer.price_includes && (
            <AccordionItem
              value="includes"
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <AccordionTrigger className="text-xl sm:text-2xl font-bold text-gray-900 hover:no-underline px-6 sm:px-8 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span>Nos tarifs comprennent</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-900 text-base sm:text-lg leading-relaxed whitespace-pre-line bg-white px-6 sm:px-8 pb-6 pt-2">
                  {offer.price_includes}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {offer.price_excludes && (
            <AccordionItem
              value="excludes"
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <AccordionTrigger className="text-xl sm:text-2xl font-bold text-gray-900 hover:no-underline px-6 sm:px-8 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span>Nos tarifs ne comprennent pas</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-gray-900 text-base sm:text-lg leading-relaxed whitespace-pre-line bg-white px-6 sm:px-8 pb-6 pt-2">
                  {offer.price_excludes}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </section>
      {slug === "voyage-tunisie-2026-circuit-groupe-voyage-organise-a-dates-fixes-13-jours" && (
        <Script id="convertbubble-312" strategy="afterInteractive">{`(async function () {let dataHtml = await fetch('https://app.convertbubble.net/hooks/project/getHtmlData?project_id=312&embed=0');let dataHtmlJson = await dataHtml.json(); dataHtmlJson.status && document.querySelector('body').appendChild(document.createRange().createContextualFragment(dataHtmlJson.data));})();`}</Script>
      )}
    </div>
  );
}
