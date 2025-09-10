import Image from "next/image";
import Link from "next/link";
import { TravelTheme } from "@/types";

interface ThemeCardProps {
  theme: TravelTheme;
}

export default function ThemeCard({ theme }: ThemeCardProps) {
  return (
    <Link href={`/themes/${theme.slug}`} className="group">
      <div className="bg-white p-2 rounded-2xl border-gray-100 border-2 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-48">
          {theme.image_url ? (
            <Image
              src={theme.image_url}
              alt={theme.title}
              fill
              className="object-cover transition-transform rounded-xl duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Pas d&apos;image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t rounded-xl from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-semibold font-[Alro]">{theme.title}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
