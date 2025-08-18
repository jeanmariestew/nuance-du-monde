"use client";

import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/types";

type Props = { destination: Destination };

export default function DestinationCard({ destination }: Props) {
  const img = destination.banner_image_url || destination.image_url;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-md group h-[420px] w-full">
      {img ? (
        <Image
          src={img}
          alt={destination.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 80vw, 420px"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* content */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="text-white text-3xl font-bold drop-shadow-sm">{destination.title}</h3>
        <Link
          href={`/demander-devis?destination=${encodeURIComponent(destination.slug)}`}
          className="inline-block mt-4 px-6 py-2 rounded-xl bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-400 transition-colors"
        >
          Explorer
        </Link>
      </div>

      {/* rounded corners mask for image */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5 rounded-3xl" />
    </div>
  );
}
