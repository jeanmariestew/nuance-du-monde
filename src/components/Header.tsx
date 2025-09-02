"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.noire_blanc.png"
              alt="Nuance du Monde"
              width={150}
              height={42}
              className="h-8 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="flex justify-between items-center space-x-8">
            <Link
              href="/type-de-voyage"
              className="text-gray-700 hidden md:block hover:text-black transition-colors text-sm font-medium"
            >
              Type de voyage
            </Link>
            <Link
              href="/destinations"
              className="text-gray-700  hidden md:block hover:text-black transition-colors text-sm font-medium"
            >
              Destinations
            </Link>
            <Link
              href="/themes"
              className="text-gray-700 hidden md:block hover:text-black transition-colors text-sm font-medium"
            >
              Thème de voyage
            </Link>

            {/* Menu Mobile */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </nav>
          <Link
            href="/demander-devis"
            className="px-3 py-4 border border-black rounded-md transition-colors inline-block text-sm font-medium"
          >
            Demander un devis
          </Link>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/type-de-voyage"
                className="text-gray-200  transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Type de voyage
              </Link>
              <Link
                href="/destinations"
                className="text-gray-200  transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link
                href="/themes"
                className="text-gray-200  transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Thème de voyage
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
