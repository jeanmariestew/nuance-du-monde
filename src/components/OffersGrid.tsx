"use client";

import { useEffect, useRef, useState } from "react";
import { Offer, Destination, TravelType, TravelTheme } from "@/types";
import OfferCard from "@/components/cards/OfferCard";
import { OfferCardSkeleton } from "@/components/ui/SkeletonLoader";
import { api } from "@/lib/axios";
import { useProfessional } from "@/contexts/ProfessionalContext";

const CONTINENT_ORDER = [
  "Afrique",
  "Amérique du Nord",
  "Amérique du Sud",
  "Asie",
  "Europe",
  "Océanie",
];

const filterFieldClass =
  "box-border h-11 w-full appearance-none rounded-md border border-yellow-500 bg-yellow-500 px-3 pr-9 text-sm font-medium text-neutral-900 focus:outline-none disabled:opacity-60";

const filterMenuClass =
  "absolute z-30 mt-1 w-full rounded-md border border-neutral-200 bg-white py-1 text-neutral-900 shadow-lg";

function filterOptionClass(selected: boolean) {
  return `block w-full px-3 py-2 text-left text-sm text-neutral-900 hover:bg-neutral-100 ${selected ? "bg-neutral-100 font-semibold" : ""}`;
}

function FilterChevron() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-neutral-900">
      ▾
    </span>
  );
}

function groupDestinationsByContinent(destinations: Destination[]) {
  const collator = new Intl.Collator("fr", { sensitivity: "base" });
  const groups = new Map<string, Destination[]>();
  for (const destination of destinations) {
    const continent = destination.continent?.trim() || "Autres";
    const list = groups.get(continent) ?? [];
    list.push(destination);
    groups.set(continent, list);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => collator.compare(a.title, b.title));
  }
  return [...groups.keys()]
    .sort((a, b) => {
      const indexA = CONTINENT_ORDER.indexOf(a);
      const indexB = CONTINENT_ORDER.indexOf(b);
      if (indexA === -1 && indexB === -1) return collator.compare(a, b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    })
    .map((continent) => ({ continent, destinations: groups.get(continent)! }));
}

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
  /** false : toutes les offres sur la page, deux par deux, sans pagination */
  paginate?: boolean;
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
  paginate = true,
}: OffersGridProps) {
  const { session } = useProfessional();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les filtres additionnels
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [openMenu, setOpenMenu] = useState<null | "destination" | "type" | "theme">(null);
  const [openContinent, setOpenContinent] = useState<string | null>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!filtersRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

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
  const currentOffers = paginate ? offers.slice(startIndex, endIndex) : offers;

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
            <div className="m-auto flex max-w-3xl flex-wrap items-end gap-4" ref={filtersRef}>
              {/* Select Destination - affiché si pas le paramètre principal */}
              {!destination && destinations.length > 0 && (
                <div className="relative min-w-[220px] flex-1 basis-0">
                  <label id="destination-filter-label" className="mb-2 block text-sm font-medium text-gray-700">
                    Destination
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      aria-labelledby="destination-filter-label"
                      aria-expanded={openMenu === "destination"}
                      disabled={filtersLoading}
                      onClick={() => {
                        setOpenMenu((current) => {
                          const next = current === "destination" ? null : "destination";
                          if (next) {
                            const selected = destinations.find((dest) => dest.slug === selectedDestination);
                            setOpenContinent(selected?.continent?.trim() || null);
                          }
                          return next;
                        });
                      }}
                      className={`${filterFieldClass} truncate text-left`}
                    >
                      {destinations.find((dest) => dest.slug === selectedDestination)?.title || "Toutes les destinations"}
                    </button>
                    <FilterChevron />
                  </div>
                  {openMenu === "destination" && (
                    <div className={filterMenuClass}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDestination("");
                          setOpenMenu(null);
                        }}
                        className={filterOptionClass(!selectedDestination)}
                      >
                        Toutes les destinations
                      </button>
                      {groupDestinationsByContinent(destinations).map((group) => {
                        const expanded = openContinent === group.continent;
                        return (
                          <div key={group.continent}>
                            <button
                              type="button"
                              aria-expanded={expanded}
                              onClick={() => setOpenContinent(expanded ? null : group.continent)}
                              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-100"
                            >
                              <span>{group.continent}</span>
                              <span className="text-xs font-normal">
                                {group.destinations.length} pays {expanded ? "▴" : "▾"}
                              </span>
                            </button>
                            {expanded && group.destinations.map((dest) => (
                              <button
                                key={dest.slug}
                                type="button"
                                onClick={() => {
                                  setSelectedDestination(dest.slug);
                                  setOpenMenu(null);
                                }}
                                className={`block w-full py-2 pl-6 pr-3 text-left text-sm text-neutral-700 hover:bg-neutral-100 ${selectedDestination === dest.slug ? "bg-neutral-100 font-semibold text-neutral-900" : ""}`}
                              >
                                {dest.title}
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Select Type - affiché si pas le paramètre principal */}
              {!type && types.length > 0 && (
                <div className="relative min-w-[220px] flex-1 basis-0">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nos Types de voyages
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      aria-expanded={openMenu === "type"}
                      disabled={filtersLoading}
                      onClick={() => setOpenMenu((current) => current === "type" ? null : "type")}
                      className={`${filterFieldClass} truncate text-left`}
                    >
                      {types.find((item) => item.slug === selectedType)?.title || "Tous les types"}
                    </button>
                    <FilterChevron />
                  </div>
                  {openMenu === "type" && (
                    <div className={filterMenuClass}>
                      <button type="button" onClick={() => { setSelectedType(""); setOpenMenu(null); }} className={filterOptionClass(!selectedType)}>
                        Tous les types
                      </button>
                      {types.map((item) => (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => { setSelectedType(item.slug); setOpenMenu(null); }}
                          className={filterOptionClass(selectedType === item.slug)}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Select Thème - affiché si pas le paramètre principal */}
              {!theme && themes.length > 0 && (
                <div className="relative min-w-[220px] flex-1 basis-0">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Thème
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      aria-expanded={openMenu === "theme"}
                      disabled={filtersLoading}
                      onClick={() => setOpenMenu((current) => current === "theme" ? null : "theme")}
                      className={`${filterFieldClass} truncate text-left`}
                    >
                      {themes.find((item) => item.slug === selectedTheme)?.title || "Tous les thèmes"}
                    </button>
                    <FilterChevron />
                  </div>
                  {openMenu === "theme" && (
                    <div className={filterMenuClass}>
                      <button type="button" onClick={() => { setSelectedTheme(""); setOpenMenu(null); }} className={filterOptionClass(!selectedTheme)}>
                        Tous les thèmes
                      </button>
                      {themes.map((item) => (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => { setSelectedTheme(item.slug); setOpenMenu(null); }}
                          className={filterOptionClass(selectedTheme === item.slug)}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
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
            {paginate && offers.length > itemsPerPage && (
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
