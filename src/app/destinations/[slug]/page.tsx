import Image from "next/image";
import Link from "next/link";
import OfferCard from "@/components/cards/OfferCard";
import { Destination, Offer } from "@/types";
import { generateMetadata as getMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return await getMetadata("destination", slug);
}

async function getDestination(
  slug: string
): Promise<{ destination: Destination | null; offers: Offer[] }> {
  try {
    const [destinationRes, offersRes] = await Promise.all([
      fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/destinations/${slug}`,
        { cache: "no-store" }
      ),
      fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/offers?destination=${encodeURIComponent(slug)}`,
        { cache: "no-store" }
      ),
    ]);

    const destinationData = await destinationRes.json();
    const offersData = await offersRes.json();

    return {
      destination: destinationData.success ? destinationData.data : null,
      offers: offersData.success ? offersData.data : [],
    };
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    return { destination: null, offers: [] };
  }
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const { destination, offers } = await getDestination(slug);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Destination non trouvée
          </h1>
          <p className="text-gray-600 mb-8">
            Cette destination n&apos;existe pas ou n&apos;est plus disponible.
          </p>
          <Link
            href="/destinations"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0">
          {destination.banner_image_url ? (
            <Image
              src={destination.banner_image_url||''}
              alt={destination.title}
              fill
              className="object-cover"
            />
          ) : destination.image_url ? (
            <Image
              src={destination.image_url}
              alt={destination.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{destination.title}</h1>
          {destination.short_description && (
            <p className="text-xl">{destination.short_description}</p>
          )}
        </div>
      </section>


      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {destination.description && (
                <div className="prose max-w-none mb-10">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: destination.description,
                    }}
                  />
                </div>
              )}

              {/* Offers for this Destination */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">
                  Offres au {destination.title}
                </h2>
                {offers.length === 0 ? (
                  <p className="text-gray-600">
                    Aucune offre n&apos;est disponible pour cette destination
                    pour le moment.
                  </p>
                ) : (
                  <div className="space-y-6">

                    {offers.map((offer: Offer) => (
                      <OfferCard key={offer.slug} offer={offer} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
