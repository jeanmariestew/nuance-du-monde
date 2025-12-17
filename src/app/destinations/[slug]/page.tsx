import Link from "next/link";
import { Destination, Offer } from "@/types";
import { generateMetadata as getMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import DestinationClient from "./DestinationClient";

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
      fetch(`/api/destinations/${slug}`, { cache: "no-store" }),
      fetch(`/api/offers?destination=${encodeURIComponent(slug)}`, {
        cache: "no-store",
      }),
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

  return <DestinationClient destination={destination} slug={slug} />;
}
