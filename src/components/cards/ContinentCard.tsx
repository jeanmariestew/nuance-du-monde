"use client";

import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";

type Props = {
  name: string;
  image?: string;
  compact?: boolean;
};

export default function ContinentCard({ name, image, compact = false }: Props) {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden shadow-md group w-full ${
        compact ? "h-[170px] sm:h-[260px] lg:h-[320px]" : "h-[420px]"
      }`}
    >
      {image ? (
        <OptimizedImage
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 80vw, 420px"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-300" />
      )}

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/0 to-black/50"></div>

      {/* content */}
      <div className={`absolute flex flex-col items-center inset-x-0 bottom-0 ${compact ? "p-3 sm:p-5" : "p-6"}`}>
        <h3 className={`text-white font-bold drop-shadow-sm font-[Alro] uppercase ${compact ? "text-base sm:text-xl lg:text-2xl" : "text-2xl"}`}>
          {name}
        </h3>
        <Link
          href={`/destinations?continent=${encodeURIComponent(name)}`}
          className={`inline-block px-4 py-2 text-sm rounded-md bg-[#d9a900] text-white font-semibold shadow hover:bg-[#d9a900] transition-colors ${compact ? "mt-1.5 sm:mt-3" : "mt-4"}`}
        >
          Explorer
        </Link>
      </div>

      {/* rounded corners mask for image */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5 rounded-3xl" />
    </div>
  );
}
