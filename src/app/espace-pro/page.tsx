"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { TravelType, Offer } from "@/types";
import { api } from "@/lib/axios";
import { useProfessional } from "@/contexts/ProfessionalContext";
import ProfessionalAuthModal from "@/components/ProfessionalAuthModal";
import { Briefcase, Lock, LogOut, ArrowRight, BadgeDollarSign, Sparkles, Handshake, ChevronLeft, ChevronRight } from "lucide-react";

export default function EspaceProPage() {
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 6;
  const { session, logout } = useProfessional();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const [typesRes, offersRes] = await Promise.all([
          api.get("/travel-types?active=true&proOnly=true"),
          api.get("/offers?active=true&proOnly=true"),
        ]);

        if (typesRes.data.success) {
          setTravelTypes(typesRes.data.data);
        }
        if (offersRes.data.success) {
          setOffers(offersRes.data.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données Pro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.isAuthenticated]);

  // Page non authentifiée
  if (!session?.isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black">
        {/* Hero Section */}
        <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <OptimizedImage
              src="/images/photo_type-de-voyage.png"
              alt="Espace Professionnel"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-gray-900/50 to-gray-900" />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
              <Briefcase className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-semibold">Espace Réservé</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-[Alro] uppercase">
              Espace Professionnel
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Accédez à nos offres exclusives réservées aux professionnels du voyage. 
              Des tarifs préférentiels et des produits sur-mesure pour vos clients.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Lock className="w-5 h-5" />
                Se connecter
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-semibold py-4 px-8 rounded-lg transition-all"
              >
                Créer un compte Pro
              </button>
            </div>
          </div>
        </div>

        {/* Avantages Section */}
        <div className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 font-[Alro] uppercase">
              Pourquoi rejoindre l&apos;espace Pro ?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BadgeDollarSign className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Tarifs Préférentiels</h3>
                <p className="text-gray-400">
                  Bénéficiez de remises exclusives sur l&apos;ensemble de notre catalogue de voyages.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Offres Exclusives</h3>
                <p className="text-gray-400">
                  Accédez à des voyages et expériences réservés uniquement aux professionnels.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Handshake className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Support Dédié</h3>
                <p className="text-gray-400">
                  Un conseiller dédié pour vous accompagner dans tous vos projets.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProfessionalAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  // Page authentifiée
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Pro */}
      <div className="bg-linear-to-r from-gray-900 to-black text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-[Alro] uppercase">Espace Professionnel</h1>
              <p className="text-gray-400">
                Bienvenue, <span className="text-yellow-500">{session.agencyName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Types de voyage Pro */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-[Alro] uppercase">
                Types de Voyage Exclusifs
              </h2>
              <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded">
                PRO
              </span>
            </div>

            {travelTypes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {travelTypes.map((type) => (
                  <Link
                    key={type.id}
                    href={`/type-de-voyage/${type.slug}`}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-64">
                      {type.image_url ? (
                        <OptimizedImage
                          src={type.image_url}
                          alt={type.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                          <Briefcase className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                      
                      {/* Badge Pro */}
                      <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                        PRO
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2 font-[Alro] uppercase">{type.title}</h3>
                      {type.short_description && (
                        <p className="text-sm text-gray-200 line-clamp-2">{type.short_description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Aucun type de voyage exclusif disponible pour le moment.
                </p>
              </div>
            )}
          </section>

          {/* Offres Pro */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-[Alro] uppercase">
                Offres Exclusives Pro
              </h2>
              <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded">
                PRO
              </span>
            </div>

            {offers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {offers
                    .slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage)
                    .map((offer) => (
                    <Link
                      key={offer.id}
                      href={`/offers/${offer.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-yellow-300"
                    >
                      <div className="relative h-56">
                        {offer.image_main || offer.image_url ? (
                          <OptimizedImage
                            src={offer.image_main || offer.image_url || ""}
                            alt={offer.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                            <Briefcase className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                        
                        {/* Badge Pro */}
                        <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                          PRO
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">{offer.title}</h3>
                        {offer.short_description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{offer.short_description}</p>
                        )}
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          {offer.price ? (
                            <div>
                              <span className="text-xs text-gray-500">À partir de</span>
                              <p className="text-xl font-bold text-yellow-600">
                                {offer.price.toLocaleString()} {offer.price_currency || "CAD"}
                              </p>
                            </div>
                          ) : (
                            <div />
                          )}
                          <span className="flex items-center gap-1 text-yellow-600 font-semibold text-sm group-hover:gap-2 transition-all">
                            Voir <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {offers.length > offersPerPage && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: Math.ceil(offers.length / offersPerPage) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? "bg-yellow-500 text-white"
                            : "border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(offers.length / offersPerPage), p + 1))}
                      disabled={currentPage === Math.ceil(offers.length / offersPerPage)}
                      className="p-2 rounded-lg border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Aucune offre exclusive disponible pour le moment.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
