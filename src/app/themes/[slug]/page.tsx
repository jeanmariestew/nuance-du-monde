import Image from "next/image";
import Link from "next/link";
import { Offer, TravelTheme } from "@/types";
import OfferCard from "@/components/cards/OfferCard";
import { generateMetadata as getMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import OffersGrid from "@/components/OffersGrid";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return await getMetadata('theme', slug);
}

async function getThemeData(slug: string): Promise<{ theme: TravelTheme | null; offers: Offer[] }> {
  try {
    const [themeRes, offersRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/travel-themes/${slug}`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/offers?theme=${encodeURIComponent(slug)}`, { cache: 'no-store' })
    ]);

    const themeData = await themeRes.json();
    const offersData = await offersRes.json();

    return {
      theme: themeData.success ? themeData.data : null,
      offers: offersData.success ? offersData.data : []
    };
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return { theme: null, offers: [] };
  }
}

export default async function ThemePage({ params }: PageProps) {
  const { slug } = await params;
  const { theme, offers } = await getThemeData(slug);

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Thème non trouvé</h1>
          <p className="text-gray-600 mb-8">Ce thème n&apos;existe pas ou n&apos;est plus disponible.</p>
          <Link href="/themes" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Retour aux thèmes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-80 flex items-center justify-center">
        <div className="absolute inset-0">
          {theme.banner_image_url ? (
            <Image src={theme.banner_image_url} alt={theme.title} fill className="object-cover" />
          ) : theme.image_url ? (
            <Image src={theme.image_url} alt={theme.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{theme.title}</h1>
          {theme.short_description && (
            <p className="text-lg md:text-xl mt-2 max-w-3xl mx-auto">{theme.short_description}</p>
          )}
        </div>
      </section>


      {/* Offres pour ce thème */}
      <OffersGrid 
        theme={slug}
        title="Offres pour ce thème"
        emptyMessage="Aucune offre pour ce thème."
      />
    </div>
  );
}
