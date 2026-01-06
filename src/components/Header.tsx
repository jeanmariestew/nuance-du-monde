"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import DestinationsDropdown from "./DestinationsDropdown";
import MobileDestinationsMenu from "./MobileDestinationsMenu";
import TravelTypesDropdown from "./TravelTypesDropdown";
import TravelThemesDropdown from "./TravelThemesDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDestinationsDropdown, setShowDestinationsDropdown] = useState(false);
  const [showTypesDropdown, setShowTypesDropdown] = useState(false);
  const [showThemesDropdown, setShowThemesDropdown] = useState(false);
  const [showMobileDestinations, setShowMobileDestinations] = useState(false);
  const destinationsRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);
  const themesRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownEnter = (dropdown: 'destinations' | 'types' | 'themes') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowDestinationsDropdown(dropdown === 'destinations');
    setShowTypesDropdown(dropdown === 'types');
    setShowThemesDropdown(dropdown === 'themes');
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDestinationsDropdown(false);
      setShowTypesDropdown(false);
      setShowThemesDropdown(false);
    }, 300);
  };

  // Nettoyage du timeout à la destruction du composant
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Fermer les menus quand on ferme le menu mobile
  const handleMobileMenuClose = () => {
    setIsMenuOpen(false);
    setShowMobileDestinations(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xl shadow-black/20">
      <div className="container mx-auto px-4 py-4">
        <div className={clsx("flex items-center justify-between",isMenuOpen && "hidden")}>
          {/* Logo */}
          <Link href="/" className={clsx("flex items-center")}>
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
            {/* Menu Types Desktop */}

              <Link
                href="/qui-sommes-nous/"
                className="text-black text-center transition-colors"
                onClick={handleMobileMenuClose}
              >
                Qui sommes nous
              </Link>
            <div 
              ref={typesRef}
              className="relative hidden lg:block"
              onMouseEnter={() => handleDropdownEnter('types')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href="/type-de-voyage"
                className="text-gray-700 hover:text-black transition-colors text-base font-medium flex items-center gap-1"
              >
                Type de voyage
              </Link>
              {showTypesDropdown && (
                <TravelTypesDropdown onClose={() => setShowTypesDropdown(false)} />
              )}
            </div>
            
            {/* Menu Types Tablette */}
            <div className="relative hidden md:block lg:hidden">
              <Link
                href="/type-de-voyage"
                className="text-gray-700 hover:text-black transition-colors text-base font-medium"
              >
                Type de voyage
              </Link>
            </div>
            
            {/* Menu Destinations Desktop */}
            <div 
              ref={destinationsRef}
              className="relative hidden lg:block"
              onMouseEnter={() => handleDropdownEnter('destinations')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href="/destinations"
                className="text-gray-700 hover:text-black transition-colors text-base font-medium flex items-center gap-1"
              >
                Destinations
              </Link>
              {showDestinationsDropdown && (
                <DestinationsDropdown onClose={() => setShowDestinationsDropdown(false)} />
              )}
            </div>
            
            {/* Menu Destinations Tablette */}
            <div className="relative hidden md:block lg:hidden">
              <Link
                href="/destinations"
                className="text-gray-700 hover:text-black transition-colors text-base font-medium"
              >
                Destinations
              </Link>
            </div>
            
            {/* Menu Thèmes Desktop */}
            <div 
              ref={themesRef}
              className="relative hidden lg:block"
              onMouseEnter={() => handleDropdownEnter('themes')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href="/themes"
                className="text-gray-700 hover:text-black transition-colors text-base font-medium flex items-center gap-1"
              >
                Thème de voyage
              </Link>
              {showThemesDropdown && (
                <TravelThemesDropdown onClose={() => setShowThemesDropdown(false)} />
              )}
            </div>
            
            {/* Menu Thèmes Tablette */}
            <div className="relative hidden md:block lg:hidden">
              <Link
                href="/themes"
                className="text-gray-700 hover:text-black transition-colors text-base font-medium"
              >
                Thème de voyage
              </Link>
            </div>

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
            href="/devis-personnalise"
            className={clsx("px-4 py-4 border border-black rounded-md transition-colors inline-block text-base font-medium")}
          >
            Demander un devis
          </Link>
        </div>

        {/* Menu Mobile & Tablette Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 h-screen flex flex-col justify-center items-center ">
            <nav className="flex flex-col space-y-7 max-w-sm w-full px-4">
              <Link
                href="/type-de-voyage"
                className="text-black text-center transition-colors"
                onClick={handleMobileMenuClose}
              >
                Type de voyage
              </Link>
              <div className="text-center">
                <button
                  onClick={() => setShowMobileDestinations(!showMobileDestinations)}
                  className="text-black transition-colors mb-2 font-medium"
                >
                  Destinations
                </button>
                {showMobileDestinations && (
                  <MobileDestinationsMenu onClose={handleMobileMenuClose} />
                )}
              </div>
              <Link
                href="/themes"
                className="text-black text-center transition-colors"
                onClick={handleMobileMenuClose}
              >
                Thème de voyage
              </Link>
              <Link
                href="/themes"
                className="text-black text-center transition-colors"
                onClick={handleMobileMenuClose}
              >
                Qui sommes nous
              </Link>
              <Link
                href="/devis-personnalise"
                className="text-black text-center transition-colors mt-8 px-4 py-2 border border-black rounded-md"
                onClick={handleMobileMenuClose}
              >
                Demander un devis
              </Link>
            </nav>
            <XIcon className="w-14 h-14 absolute top-4 right-4 cursor-pointer" onClick={() => setIsMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
