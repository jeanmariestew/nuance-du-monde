"use client";

import { useEffect, useState } from "react";
import { Offer, Destination, TravelType, TravelTheme } from "@/types";
import OfferCard from "@/components/cards/OfferCard";

interface OffersGridProps {
  destination?: string;
  type?: string;
  theme?: string;
  title?: string;
  emptyMessage?: string;
  itemsPerPage?: number;
}

export default function OffersGrid({
  destination,
  type,
  theme,
  title = "Offres",
  emptyMessage = "Aucune offre disponible.",
  itemsPerPage = 4,
}: OffersGridProps) {
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
        if (type) params.append("type", type);
        if (theme) params.append("theme", theme);

        const response = await fetch(
          `/api/offers/filters?${params.toString()}`
        );
        const data = await response.json();

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
  }, [destination, type, theme]); // Retirer selectedDestination, selectedType, selectedTheme des dépendances

  // Charger les offres
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        // Paramètres principaux
        if (destination) params.append("destination", destination);
        if (type) params.append("type", type);
        if (theme) params.append("theme", theme);

        // Paramètres des selects
        if (selectedDestination)
          params.append("destination", selectedDestination);
        if (selectedType) params.append("type", selectedType);
        if (selectedTheme) params.append("theme", selectedTheme);

        const response = await fetch(`/api/offers?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setOffers(data.data);
          setCurrentPage(1); // Retourner à la première page quand les offres changent
        } else {
          setError("Erreur lors du chargement des offres");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des offres:", err);
        setError("Erreur lors du chargement des offres");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [
    destination,
    type,
    theme,
    selectedDestination,
    selectedType,
    selectedTheme,
  ]);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Chargement des offres...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
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
    <section className="py-12">
      <div className="container mx-auto max-w-6xl">
        {/* Filtres dynamiques */}
        {itemsPerPage < 10 && (
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-wrap gap-4 items-end m-auto max-w-xl">
              {/* Select Destination - affiché si pas le paramètre principal */}
              {!destination && destinations.length > 0 && (
                <div className="flex-1 min-w-[200px]">
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
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de voyage
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
                <div className="flex-1 min-w-[200px]">
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
                    Retirer tout les filtres
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
          <div className="text-gray-600">{emptyMessage}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10">
              {currentOffers.map((offer) => (
                <OfferCard key={offer.slug} offer={offer} />
              ))}
            </div>

            {/* Pagination - affichée seulement si plus de 4 offres */}
            {offers.length > itemsPerPage && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                {/* Bouton Précédent */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-yellow-500 text-yellow-500"
                  }`}
                >
                  ← Précédent
                </button>

                {/* Numéros de pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === page
                          ? "bg-yellow-500 text-white"
                          : "bg-white border border-yellow-500 text-yellow-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Bouton Suivant */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-yellow-500 text-yellow-500"
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
