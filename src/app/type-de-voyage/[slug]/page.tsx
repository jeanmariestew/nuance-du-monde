import Image from "next/image";
import Link from "next/link";
import { Offer, TravelType } from "@/types";
import OfferCard from "@/components/cards/OfferCard";
import { generateMetadata as getMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return await getMetadata('travel-type', params.slug);
}

async function getTravelTypeData(slug: string): Promise<{ type: TravelType | null; offers: Offer[] }> {
  try {
    const [typeRes, offersRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/travel-types/${slug}`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/offers?type=${encodeURIComponent(slug)}`, { cache: 'no-store' })
    ]);

    const typeData = await typeRes.json();
    const offersData = await offersRes.json();

    return {
      type: typeData.success ? typeData.data : null,
      offers: offersData.success ? offersData.data : []
    };
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return { type: null, offers: [] };
  }
}

export default async function TravelTypeDetailPage({ params }: PageProps) {
  const slug = params.slug;
  const { type, offers } = await getTravelTypeData(slug);

  if (!type) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Type non trouvé</h1>
          <p className="text-gray-600 mb-8">Ce type de voyage n&apos;existe pas ou n&apos;est plus disponible.</p>
          <Link href="/type-de-voyage" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Retour aux types de voyage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-80 flex items-center justify-center">
        <div className="absolute inset-0">
          {type.image_url ? (
            <Image src={type.image_url} alt={type.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{type.title}</h1>
          {type.short_description && (
            <p className="text-lg md:text-xl mt-2 max-w-3xl mx-auto">{type.short_description}</p>
          )}
        </div>
      </section>


      {/* <section className="py-6">
        <div className="container mx-auto px-4">
          <Link
            href={`/offers?type=${type.slug}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir les offres pour ce type
          </Link>
        </div>
      </section> */}

      {/* Offres pour ce type */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Offres pour ce type</h2>
          {offers.length === 0 ? (
            <div className="text-gray-600">Aucune offre pour ce type.</div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {offers.map((offer) => (
                <OfferCard key={offer.slug} offer={offer} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
