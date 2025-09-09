"use client";

import Image from "next/image";
import Link from "next/link";
import type { TravelTheme } from "@/types";

type Props = { theme: TravelTheme };

export default function ThemeCard({ theme }: Props) {
  const img = theme.banner_image_url || theme.image_url;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-md group h-[420px] w-full">
      {img ? (
        <Image
          src={img}
          alt={theme.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 80vw, 360px"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80"></div>

      {/* content */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="text-white text-2xl font-bold drop-shadow-sm font-[Alro]">
          {theme.title}
        </h3>
        <Link
          href={`/themes/${encodeURIComponent(theme.slug)}`}
          className="inline-block mt-4 px-4 py-2 text-sm rounded-md bg-[#d9a900] text-white font-semibold shadow hover:bg-[#d9a900] transition-colors"
        >
          Explorer
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5 rounded-3xl" />
    </div>
  );
}
