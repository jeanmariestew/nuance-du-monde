import Link from "next/link";
import Image from "next/image";
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
    const url = `/api/offers/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { cache: "no-store" });

  alert("SERVER fetch url:"+ url);
  alert("SERVER status:"+ res.status);
  alert("SERVER content-type:"+ res.headers.get("content-type"));
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
  const coverImage = offer.images?.find(img => img.image_type === 'banner')?.image_url ||
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
            <Image
              src={coverImage}
              alt={offer.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </>
        ) : (
          /* Fond gris si pas d'image */
          <div className="absolute inset-0 bg-gray-200" />
        )}
        
        {/* Titre superposé */}
        <div className="absolute inset-0 flex items-end">
          <div className="site-container pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-4xl">
              <span className={`inline-block px-4 py-2 ${coverImage ? 'bg-yellow-500/90 text-white' : 'bg-yellow-500 text-white'} text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full mb-4`}>
                {offer.destinations?.[0]?.title || 'Voyage'}
              </span>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 ${coverImage ? 'text-white drop-shadow-2xl' : 'text-gray-800'}`}>
                {offer.title}
              </h1>
              {offer.subtitle && (
                <p className={`text-lg sm:text-xl lg:text-2xl ${coverImage ? 'text-white/95 drop-shadow-lg' : 'text-gray-700'}`}>
                  {offer.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Header Section avec disposition image 1 */}
      <section className="site-container site-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left: Content */}
          <div className="order-2 lg:order-1 px-4 sm:px-0">
            <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
              DÉTAILS
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-gray-900 mt-3 sm:mt-4 mb-4 sm:mb-6 leading-tight">
              {offer.title}
            </h1>
            <div className="prose prose-base sm:prose-lg max-w-[450px] text-gray-700 leading-relaxed mb-6 sm:mb-8">
              <p className="text-sm sm:text-base">{offer.short_description}</p>
              {offer.description && (
                <p className="mt-3 sm:mt-4 text-sm sm:text-base ">{offer.description.split('\n')[0]}</p>
              )}
            </div>
            <button className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Demander un devis
            </button>
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
      />

      {/* Section Dates et Prix */}
      <DatesAndPricing
        dates={offer.dates}
        basePrice={offer.price}
        baseCurrency={offer.price_currency}
      />

      <section className="site-container site-section">
        <Accordion type="multiple" className="w-full space-y-4">

          {offer.price_includes && (
            <AccordionItem value="includes" className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <AccordionTrigger className="text-xl sm:text-2xl font-bold text-gray-900 hover:no-underline px-6 sm:px-8 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <AccordionItem value="excludes" className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <AccordionTrigger className="text-xl sm:text-2xl font-bold text-gray-900 hover:no-underline px-6 sm:px-8 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    </div>
  );
}
