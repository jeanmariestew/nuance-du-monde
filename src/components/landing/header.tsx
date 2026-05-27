"use client"

import Link from "next/link"
import OptimizedImage from "../OptimizedImage"

export function Header() {
  return (
    <header className="w-full fixed bg-white py-4 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        
          <Link href="/" className="flex items-center shrink-0">
            <OptimizedImage
              src="/images/logo.noire_blanc.png"
              alt="Nuance du Monde"
              width={100}
              height={28}
              className="h-3 sm:h-4 md:h-5 lg:h-6 xl:h-7 w-auto"
              priority
            />
          </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="destinations" className="text-[#1e293b] text-sm hover:text-[#c4a74a] transition-colors">
            Destinations
          </Link>
          <Link href="#pourquoi" className="text-[#1e293b] text-sm hover:text-[#c4a74a] transition-colors">
            {"Pourquoi la brochure ?"}
          </Link>
          <Link href="#conseillers" className="text-[#1e293b] text-sm hover:text-[#c4a74a] transition-colors">
            Conseillers
          </Link>
          <Link href="#commander" className="text-[#1e293b] text-sm hover:text-[#c4a74a] transition-colors">
            Commander
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          href="#commander"
          className="bg-[#c4a74a] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#b39740] transition-colors"
        >
          Recevoir ma brochure
        </Link>
      </div>
    </header>
  )
}
