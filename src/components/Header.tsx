'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/70 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="Nuance du Monde" width={130} height={36} className="h-9 w-auto" />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/type-de-voyage" 
              className="text-gray-200 hover:text-white transition-colors"
            >
              Type de voyage
            </Link>
            <Link 
              href="/destinations" 
              className="text-gray-200 hover:text-white transition-colors"
            >
              Destinations
            </Link>
            <Link 
              href="/themes" 
              className="text-gray-200 hover:text-white transition-colors"
            >
              Thème de voyage
            </Link>
            <Link 
              href="/demander-devis" 
              className="btn-accent px-4 py-2 rounded-full hover:brightness-95 transition-colors"
            >
              Demander un devis
            </Link>
          </nav>

          {/* Menu Mobile */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/type-de-voyage" 
                className="text-gray-200 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Type de voyage
              </Link>
              <Link 
                href="/destinations" 
                className="text-gray-200 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link 
                href="/themes" 
                className="text-gray-200 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Thème de voyage
              </Link>
              <Link 
                href="/demander-devis" 
                className="btn-accent px-4 py-2 rounded-full hover:brightness-95 transition-colors inline-block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Demander un devis
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

