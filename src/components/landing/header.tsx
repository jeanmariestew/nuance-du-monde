"use client"

import Link from "next/link"

export function Header() {
  return (
    <header className="w-full bg-white py-4 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className="text-[#1e293b] font-bold text-xl tracking-wider" style={{ fontFamily: 'sans-serif' }}>
            NUANCE
          </span>
          <span className="text-[#1e293b] font-medium text-xs tracking-widest -mt-1">
            DU MONDE
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#destinations" className="text-[#1e293b] text-sm hover:text-[#c4a74a] transition-colors">
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
