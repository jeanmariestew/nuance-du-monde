"use client";

import { useEffect, useState } from "react";
import { Offer, Destination, TravelType, TravelTheme } from "@/types";
import OfferCard from "@/components/cards/OfferCard";
import { OfferCardSkeleton } from "@/components/ui/SkeletonLoader";
import { api } from "@/lib/axios";
import { useProfessional } from "@/contexts/ProfessionalContext";

interface OffersGridProps {
  destination?: string;
  continent?: string;
  type?: string;
  theme?: string;
  title?: string;
  emptyMessage?: string;
  itemsPerPage?: number;
  hasTheme?: boolean;
  compact?: boolean;
}

export default function OffersGrid({
  destination,
  continent,
  type,
  theme,
  title = "Offres",
  emptyMessage = "Aucune offre disponible.",
  itemsPerPage = 4,
  hasTheme=false,
  compact = false,
}: OffersGridProps) {
  const { session } = useProfessional();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les filtres additionnels
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");

  // États pour les listes de sélection
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [types, setTypes] = useState<TravelType[]>([]);
  const [themes, setThemes] = useState<TravelTheme[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(false);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les listes pour les selects (uniquement ceux avec des offres)
  useEffect(() => {
    const fetchFiltersData = async () => {
      setFiltersLoading(true);
      try {
        const params = new URLSearchParams();
        if (destination) params.append("destination", destination);
        if (continent) params.append("continent", continent);
        if (type) params.append("type", type);
        if (theme) params.append("theme", theme);

        const response = await api.get(`/offers/filters?${params.toString()}`);
        const data = response.data;

        if (data.success) {
          setDestinations(data.data.destinations);
          setTypes(data.data.types);
          setThemes(data.data.themes);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des filtres:", error);
      } finally {
        setFiltersLoading(false);
      }
    };

    fetchFiltersData();
  }, [destination, continent, type, theme]);

  // Charger les offres
  useEffect(() => {
    let cancelled = false;

    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        // Paramètres principaux
        if (destination) params.append("destination", destination);
        if (continent) params.append("continent", continent);
        if (type) params.append("type", type);
        if (theme) params.append("theme", theme);
        if (hasTheme) params.append("hasActiveTheme", "true");

        // Inclure les offres pro seulement si authentifié
        if ((type || destination || continent || theme) && session?.isAuthenticated) params.append("includePro", "true");

        // Paramètres des selects
        if (selectedDestination)
          params.append("destination", selectedDestination);
        if (selectedType) params.append("type", selectedType);
        if (selectedTheme) params.append("theme", selectedTheme);

        const response = await api.get(`/offers?${params.toString()}`);
        const data = response.data;
        if (cancelled) return;

        if (data.success) {
          setOffers(data.data);
          setCurrentPage(1); // Retourner à la première page quand les offres changent
        } else {
          setError("Erreur lors du chargement des offres");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Erreur lors du chargement des offres:", err);
        setError("Erreur lors du chargement des offres");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOffers();
    return () => {
      cancelled = true;
    };
  }, [
    destination,
    continent,
    type,
    theme,
    hasTheme,
    selectedDestination,
    selectedType,
    selectedTheme,
    session?.isAuthenticated,
  ]);

  const sectionClass = compact ? "pb-8" : "py-12";
  const titleBlock = compact ? (
    <div className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
    </div>
  ) : (
    <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
  );

  if (loading) {
    return (
      <section className={sectionClass}>
        {compact ? titleBlock : null}
        <div className={`container mx-auto max-w-6xl ${compact ? "pt-4" : ""}`}>
          {compact ? null : titleBlock}
          <OfferCardSkeleton count={itemsPerPage} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={sectionClass}>
        {compact ? titleBlock : null}
        <div className={`container mx-auto max-w-6xl ${compact ? "pt-4" : ""}`}>
          {compact ? null : titleBlock}
          <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
        </div>
      </section>
    );
  }

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedDestination("");
    setSelectedType("");
    setSelectedTheme("");
    setCurrentPage(1); // Retourner à la première page
  };

  // Calculer les offres à afficher pour la page courante
  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffers = offers.slice(startIndex, endIndex);

  // Fonction pour changer de page
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut du composant
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className={sectionClass}>
      {compact ? titleBlock : null}
      <div className={`container mx-auto max-w-6xl ${compact ? "pt-4" : ""}`}>
        {compact ? null : titleBlock}
        {/* Filtres dynamiques */}
        {itemsPerPage < 10 && (
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-wrap gap-4 flex-center items-end m-auto max-w-xl">
              {/* Select Destination - affiché si pas le paramètre principal */}
              {!destination && destinations.length > 0 && (
                <div className="flex-1 max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full px-3 py-2 border border-yellow-500 bg-yellow-500 rounded-md focus:outline-none"
                    disabled={filtersLoading}
                  >
                    <option value="">Toutes les destinations</option>
                    {destinations.map((dest) => (
                      <option
                        key={dest.slug}
                        value={dest.slug}
                        className="bg-yellow-500"
                      >
                        {dest.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Select Type - affiché si pas le paramètre principal */}
              {!type && types.length > 0 && (
                <div className="flex-1 max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nos Types de voyages
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-yellow-500 bg-yellow-500 rounded-md focus:outline-none"
                    disabled={filtersLoading}
                  >
                    <option value="">Tous les types</option>
                    {types.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Select Thème - affiché si pas le paramètre principal */}
              {!theme && themes.length > 0 && (
                <div className="flex-1 max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thème
                  </label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-yellow-500 bg-yellow-500 rounded-md focus:outline-none"
                    disabled={filtersLoading}
                  >
                    <option value="">Tous les thèmes</option>
                    {themes.map((th) => (
                      <option key={th.slug} value={th.slug}>
                        {th.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Bouton de réinitialisation */}
              {(selectedDestination || selectedType || selectedTheme) && (
                <div>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    X
                  </button>
                </div>
              )}
            </div>

            {/* Indicateur de chargement des filtres */}
            {filtersLoading && (
              <div className="mt-4 text-sm text-gray-500">
                Chargement des filtres...
              </div>
            )}
          </div>
        )}
        {/* Résultats */}
        {offers.length === 0 ? (
          <div className="text-gray-700 text-center">{emptyMessage}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto auto-rows-fr">
              {currentOffers.map((offer) => (
                <OfferCard key={offer.slug} offer={offer} />
              ))}
            </div>

            {/* Pagination - affichée seulement si plus de 4 offres */}
            {offers.length > itemsPerPage && (
              <div className="mt-8 flex justify-center items-center space-x-1">
                {/* Bouton Précédent */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md text-sm ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                  }`}
                >
                  ← Précédent
                </button>

                {/* Numéros de pages intelligents */}
                {(() => {
                  const pages: (number | string)[] = [];
                  const delta = 2;
                  const left = currentPage - delta;
                  const right = currentPage + delta;

                  // Toujours montrer la page 1
                  if (left > 2) {
                    pages.push(1);
                    if (left > 3) pages.push("...");
                  }

                  // Montrer les pages autour de la page actuelle
                  for (let i = Math.max(1, left); i <= Math.min(totalPages, right); i++) {
                    pages.push(i);
                  }

                  // Toujours montrer la dernière page
                  if (right < totalPages - 1) {
                    if (right < totalPages - 2) pages.push("...");
                    pages.push(totalPages);
                  }

                  return pages.map((page, idx) => (
                    <button
                      key={`${page}-${idx}`}
                      onClick={() => typeof page === "number" && goToPage(page)}
                      disabled={typeof page === "string"}
                      className={`px-3 py-2 rounded-md text-sm ${
                        page === currentPage
                          ? "bg-yellow-500 text-white font-bold"
                          : page === "..."
                          ? "text-gray-400 cursor-default"
                          : "bg-white border border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                      }`}
                    >
                      {page}
                    </button>
                  ));
                })()}

                {/* Bouton Suivant */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                  }`}
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
