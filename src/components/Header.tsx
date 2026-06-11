"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import OptimizedImage from "@/components/OptimizedImage";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import DestinationsDropdown from "./DestinationsDropdown";
import TravelTypesDropdown from "./TravelTypesDropdown";
import TravelThemesDropdown from "./TravelThemesDropdown";
import ProfessionalAuthModal from "./ProfessionalAuthModal";
import { useProfessional } from "@/contexts/ProfessionalContext";

const Header = () => {
  const router = useRouter();
  const { session } = useProfessional();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDestinationsDropdown, setShowDestinationsDropdown] = useState(false);
  const [showTypesDropdown, setShowTypesDropdown] = useState(false);
  const [showThemesDropdown, setShowThemesDropdown] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [proModalRedirect, setProModalRedirect] = useState<string | undefined>(undefined);
  const destinationsRef = useRef<HTMLDivElement>(null);
  const typesRef = useRef<HTMLDivElement>(null);
  const themesRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownEnter = (dropdown: 'destinations' | 'types' | 'themes') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMobileMenuClose = () => {
    setIsMenuOpen(false);
  };

  // Appelé par TravelTypesDropdown quand on clique sur un type PRO sans être connecté
  const handleProTypeClick = (slug: string) => {
    setShowTypesDropdown(false);
    setProModalRedirect(`/type-de-voyage/${slug}`);
    setIsProModalOpen(true);
  };

  const handleEspaceProClick = (e: React.MouseEvent) => {
    if (!session?.isAuthenticated) {
      e.preventDefault();
      setProModalRedirect('/espace-pro');
      setIsProModalOpen(true);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xl shadow-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className={clsx("flex items-center justify-between", isMenuOpen && "hidden")}>
            {/* Logo */}
            <Link href="/" className={clsx("flex items-center")}>
              <OptimizedImage
                src="/images/logo.noire_blanc.png"
                alt="Nuance du Monde"
                width={150}
                height={42}
                className="h-6 mx-2 w-auto"
                priority
              />
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex justify-between items-center space-x-8">
              <Link
                href="/qui-sommes-nous"
                className="text-gray-700 text-sm hover:text-black transition-colors text-base font-medium"
              >
                Qui sommes nous
              </Link>

              {/* Types de voyages Desktop */}
              <div
                ref={typesRef}
                className="relative hidden lg:block"
                onMouseEnter={() => handleDropdownEnter('types')}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href="/type-de-voyage"
                  className="text-gray-700  text-sm hover:text-black transition-colors text-base font-medium flex items-center gap-1"
                >
                  Types de voyages
                </Link>
                {showTypesDropdown && (
                  <TravelTypesDropdown
                    onClose={() => setShowTypesDropdown(false)}
                    onProTypeClick={handleProTypeClick}
                  />
                )}
              </div>

              {/* Types Tablette */}
              <div className="relative hidden md:block lg:hidden">
                <Link
                  href="/type-de-voyage"
                  className="text-gray-700  text-sm hover:text-black transition-colors text-base font-medium"
                >
                  Types de voyages
                </Link>
              </div>

              {/* Destinations Desktop */}
              <div
                ref={destinationsRef}
                className="relative hidden lg:block"
                onMouseEnter={() => handleDropdownEnter('destinations')}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href="/destinations"
                  className="text-gray-700  text-sm hover:text-black transition-colors text-base font-medium flex items-center gap-1"
                >
                  Destinations
                </Link>
                {showDestinationsDropdown && (
                  <DestinationsDropdown onClose={() => setShowDestinationsDropdown(false)} />
                )}
              </div>

              {/* Destinations Tablette */}
              <div className="relative hidden md:block lg:hidden">
                <Link
                  href="/destinations"
                  className="text-gray-700  text-sm hover:text-black transition-colors text-base font-medium"
                >
                  Destinations
                </Link>
              </div>

              {/* Thèmes Desktop */}
              <div
                ref={themesRef}
                className="relative hidden lg:block"
                onMouseEnter={() => handleDropdownEnter('themes')}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href="/themes"
                  className="text-gray-700  text-sm hover:text-black transition-colors text-base font-medium flex items-center gap-1"
                >
                  Thèmes de voyages
                </Link>
                {showThemesDropdown && (
                  <TravelThemesDropdown onClose={() => setShowThemesDropdown(false)} />
                )}
              </div>

              {/* Thèmes Tablette */}
              <div className="relative hidden md:block lg:hidden">
                <Link
                  href="/themes"
                  className="text-gray-700 text-md  hover:text-black transition-colors text-base font-medium"
                >
                  Thèmes de voyages
                </Link>
              </div>
            </nav>

            {/* Boutons Espace Pro + Devis */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/espace-pro"
                onClick={handleEspaceProClick}
                className="inline-flex text-xs items-center gap-1.5 px-3 py-2 border border-black rounded-md transition-colors text-base font-medium hover:bg-black hover:text-white"
              >
                Espace Agent de voyage
              </Link>
              <Link
                href="/devis-personnalise"
                className="px-3 py-2 border text-xs border-black rounded-md transition-colors text-base font-medium hover:bg-black hover:text-white"
              >
                Demander un devis
              </Link>
            </div>

            {/* Bouton Menu Mobile */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Ouvrir le menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Menu Mobile */}
          {isMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
              <XIcon className="w-10 h-10 absolute top-5 right-5 cursor-pointer" onClick={() => setIsMenuOpen(false)} />
              <nav className="flex flex-col items-center justify-center flex-1 gap-8 px-8">
                <Link
                  href="/type-de-voyage"
                  className="text-black text-lg text-center transition-colors"
                  onClick={handleMobileMenuClose}
                >
                  Type de voyage
                </Link>
                <Link
                  href="/destinations"
                  className="text-black text-lg text-center transition-colors"
                  onClick={handleMobileMenuClose}
                >
                  Destinations
                </Link>
                <Link
                  href="/themes"
                  className="text-black text-lg text-center transition-colors"
                  onClick={handleMobileMenuClose}
                >
                  Thème de voyage
                </Link>
                <Link
                  href="/qui-sommes-nous"
                  className="text-black text-lg text-center transition-colors"
                  onClick={handleMobileMenuClose}
                >
                  Qui sommes nous
                </Link>
                <div className="flex flex-col items-center gap-4 w-full mt-4">
                  <button
                    onClick={() => {
                      handleMobileMenuClose();
                      if (!session?.isAuthenticated) {
                        setProModalRedirect('/espace-pro');
                        setIsProModalOpen(true);
                      } else {
                        router.push('/espace-pro');
                      }
                    }}
                    className="w-full max-w-xs text-black text-center px-4 py-3 border border-black rounded-md text-base"
                  >
                    Espace Agent de voyage
                  </button>
                  <Link
                    href="/devis-personnalise"
                    className="w-full max-w-xs text-black text-center px-4 py-3 border border-black rounded-md text-base"
                    onClick={handleMobileMenuClose}
                  >
                    Demander un devis
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <ProfessionalAuthModal
        isOpen={isProModalOpen}
        onClose={() => { setIsProModalOpen(false); setProModalRedirect(undefined); }}
        redirectAfterAuth={proModalRedirect}
      />
    </>
  );
};

export default Header;
