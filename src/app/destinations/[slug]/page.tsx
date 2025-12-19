import Link from "next/link"
import type { Metadata } from "next"
import { generateMetadata as getMetadata } from "@/lib/metadata"
import type { Destination, Offer } from "@/types"
import DestinationClient from "./DestinationClient"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return await getMetadata("destination", slug)
}

async function getDestinationData(
  slug: string
): Promise<{
  destination: Destination | null
  offers: Offer[]
  otherDestinations: Destination[]
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://nuancedumonde.com"

    const [destinationRes, offersRes, allDestinationsRes] = await Promise.all([
      fetch(`${baseUrl}/api/destinations/${encodeURIComponent(slug)}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/offers?destination=${encodeURIComponent(slug)}`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/destinations?active=true`, { cache: "no-store" }),
    ])

    const destinationData = await destinationRes.json()
    const offersData = await offersRes.json()
    const allDestinationsData = await allDestinationsRes.json()

    const destination: Destination | null = destinationData?.success ? destinationData.data : null
    const offers: Offer[] = offersData?.success ? offersData.data : []

    let otherDestinations: Destination[] = []
    if (destination && allDestinationsData?.success && Array.isArray(allDestinationsData.data)) {
      const currentId = destination.id
      const currentContinent = (destination.continent || "").trim().toLowerCase()

      otherDestinations = allDestinationsData.data.filter((d: Destination) => {
        if (d.id === currentId) return false
        if (!currentContinent) return true
        return (d.continent || "").trim().toLowerCase() === currentContinent
      })
    }

    return { destination, offers, otherDestinations }
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error)
    return { destination: null, offers: [], otherDestinations: [] }
  }
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params
  const { destination, offers, otherDestinations } = await getDestinationData(slug)

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Destination non trouvée</h1>
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
    )
  }

  return (
    <DestinationClient
      destination={destination}
      slug={slug}
      offers={offers}
      otherDestinations={otherDestinations}
    />
  )
}
