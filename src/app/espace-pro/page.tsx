"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OptimizedImage from "@/components/OptimizedImage";
import { api } from "@/lib/axios";
import { useProfessional } from "@/contexts/ProfessionalContext";
import AnimatedBentoGrid from "@/components/banner/partenariat";
import {
  Briefcase, LogOut, Users, Globe, Anchor,
  Facebook, Star, ChevronLeft, ChevronRight
} from "lucide-react";
import TravelTypesSection from "@/components/TravelTypesSection";
import { TravelType } from "@/types";

interface Offer {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  price?: number;
  price_currency?: string;
  image_main?: string;
  image_url?: string;
}

function VideoEmbed({ url, className }: { url: string; className?: string }) {
  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo   = url.includes('vimeo.com');

  if (isYoutube) {
    const id = url.includes('youtu.be/')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : new URL(url).searchParams.get('v');
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0`}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isVimeo) {
    const id = url.split('vimeo.com/')[1]?.split('?')[0];
    return (
      <iframe
        src={`https://player.vimeo.com/video/${id}`}
        className={className}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video src={url} controls className={className} />
  );
}


// ---------- Page authentifiée ----------
function AuthenticatedView({
  session,
  onLogout,
  proVideoUrl,
  facebookGroupUrl,
}: {
  session: { firstName: string; lastName: string; agencyName: string };
  onLogout: () => void;
  proVideoUrl: string;
  facebookGroupUrl: string;
}) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [brochureOpen, setBrochureOpen] = useState(false);
  const { session: Session } = useProfessional();

  // Brochure form state
  const [brForm, setBrForm] = useState({ first_name: '', last_name: '', email: '', agency_name: '', phone: '', address: '', quantity: '1' });
  const [brSubmitting, setBrSubmitting] = useState(false);
  const [brSuccess, setBrSuccess] = useState('');
  const [brError, setBrError] = useState('');
  const [types, setTypes] = useState<TravelType[]>([]);
    useEffect(() => {
    const fetchTypes = async () => {
      try {
        const url = "/travel-types?active=true&includePro=true";
        const response = await api.get(url);
        const data = response.data;
        if (data.success) setTypes(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des types de voyage:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, [Session?.isAuthenticated]);

  useEffect(() => {
    api.get("/offers?active=true&proOnly=true").then((res) => {
      if (res.data.success) setOffers(res.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrError('');
    if (!brForm.first_name || !brForm.last_name || !brForm.email) {
      setBrError('Prénom, nom et email requis');
      return;
    }
    setBrSubmitting(true);
    try {
      const res = await fetch('/api/admin/brochure-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brForm, quantity: parseInt(brForm.quantity) || 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setBrSuccess(data.message);
        setBrForm({ first_name: '', last_name: '', email: '', agency_name: '', phone: '', address: '', quantity: '1' });
        setTimeout(() => { setBrochureOpen(false); setBrSuccess(''); }, 3000);
      } else {
        setBrError(data.error || 'Erreur');
      }
    } catch {
      setBrError('Une erreur est survenue');
    } finally {
      setBrSubmitting(false);
    }
  };

  const offerTypes = [
    {
      icon: Users,
      title: "Voyages en groupe",
      subtitle: "À dates fixes",
      description: "Départs garantis en groupe avec tarifs avantageux pour vos clients.",
    },
    {
      icon: Globe,
      title: "FIT",
      subtitle: "À la carte",
      description: "Voyages entièrement personnalisés selon les envies et budgets.",
    },
    {
      icon: Anchor,
      title: "Croisières",
      subtitle: "Pré/Post/Escales",
      description: "Extensions avant, après ou durant les croisières de vos clients.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Pro */}
      <div className="bg-black text-white py-4 md:py-6 px-4">
        <div className="max-w-7xl mx-auto space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#c4a74a] rounded-full flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-black" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold font-[Alro] uppercase text-[#c4a74a]">Espace Agents</h1>
              <p className="text-gray-400 text-xs md:text-sm truncate">
                Bienvenue, <span className="text-white font-semibold">{session.firstName}</span>
                {session.agencyName && <span className="text-gray-400"> • {session.agencyName}</span>}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-[#c4a74a] transition-colors text-sm md:text-base"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Section 1: Vidéo / Texte d'accueil */}
      <section className="bg-white py-12 md:py-16 px-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          {proVideoUrl ? (
            <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl aspect-video">
              <video controls className="w-full h-full border-none"  src="/uploads/Présentation_espace_Agents_de_voyages_v2.mp4" />
            </div>
          ) : (
            <div className="text-center max-w-3xl mx-auto space-y-4">w
              <span className="inline-block bg-[#c4a74a] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Espace agents
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-black font-[Alro] uppercase">
                Vos offres exclusives
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Retrouvez toutes nos offres professionnelles, brochures et ressources pour développer votre activité avec Nuance du Monde.
              </p>
            </div>
          )}
        </div>
      </section>
            <TravelTypesSection travelTypes={types} />
      

      {/* Section 2: Types d'offres 
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12 space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-black font-[Alro] uppercase">
              Nos types d&apos;offres
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto">
              Trois solutions pour répondre à tous les voyageurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {offerTypes.map(({ icon: Icon, title, subtitle, description }) => (
              <div key={title} className="bg-gray-50 rounded-xl md:rounded-2xl border border-gray-200 p-6 md:p-8 hover:border-[#c4a74a] hover:shadow-md transition-all">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-black rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-[#c4a74a]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-1">{title}</h3>
                <p className="text-xs md:text-sm font-medium text-gray-500 mb-3">{subtitle}</p>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
          {/* Offres du catalogue 
          {loading ? (
            <div className="flex justify-center mt-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
          ) : offers.length > 0 && (
            <div className="mt-10 md:mt-12">
              <h3 className="text-xl md:text-2xl font-bold text-black mb-6">Offres disponibles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {offers
                  .slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage)
                  .map((offer) => (
                    <Link
                      key={offer.id}
                      href={`/offers/${offer.slug}`}
                      className="group bg-white rounded-lg md:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-[#c4a74a]"
                    >
                      <div className="relative h-40 md:h-48">
                        {offer.image_main || offer.image_url ? (
                          <OptimizedImage
                            src={offer.image_main || offer.image_url || ""}
                            alt={offer.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black text-[#c4a74a] text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded">
                          AGENT
                        </div>
                      </div>
                      <div className="p-4 md:p-5">
                        <h4 className="font-bold text-gray-900 text-sm md:text-base mb-2 line-clamp-2">{offer.title}</h4>
                        {offer.short_description && (
                          <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mb-3">{offer.short_description}</p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          {offer.price ? (
                            <span className="text-base md:text-lg font-bold text-black">
                              {offer.price.toLocaleString()} {offer.price_currency || "CAD"}
                            </span>
                          ) : <span />}
                          <span className="flex items-center gap-1 text-xs md:text-sm font-semibold text-black group-hover:gap-2 transition-all">
                            Voir <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              {offers.length > offersPerPage && (
                <div className="flex items-center justify-center gap-1 md:gap-2 mt-8">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="p-1.5 md:p-2 rounded-lg border border-gray-200 hover:border-black disabled:opacity-40 transition-all">
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <div className="hidden sm:flex gap-1 md:gap-2">
                    {Array.from({ length: Math.ceil(offers.length / offersPerPage) }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg font-semibold text-sm transition-all ${currentPage === page ? 'bg-black text-[#c4a74a]' : 'border border-gray-200 hover:border-black'}`}>
                        {page}
                      </button>
                    ))}
                  </div>
                  <div className="sm:hidden text-xs font-medium text-gray-600">
                    {currentPage} / {Math.ceil(offers.length / offersPerPage)}
                  </div>
                  <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(offers.length / offersPerPage), p + 1))} disabled={currentPage === Math.ceil(offers.length / offersPerPage)}
                    className="p-1.5 md:p-2 rounded-lg border border-gray-200 hover:border-black disabled:opacity-40 transition-all">
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              )}
            </div>
          )} 
        </div>
      </section>*/}

      {/* Section Brochure 2026 */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-r from-amber-100 to-orange-100 text-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-[Alro] uppercase">
              Découvrez notre brochure 2026
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-2xl">
              Explorez nos dernières offres de voyages, nos destinations exclusives et tous les détails de nos services professionnels pour 2026.
            </p>
            <div>
              <Link
                href="/brochure_2026"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 transition-colors"
              >
                Consulter la brochure
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Groupes Facebook */}
      <section className="py-12 md:py-16 px-4 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-[#c4a74a] rounded-full flex items-center justify-center mx-auto">
            <Facebook className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold font-[Alro] uppercase">
              Nos groupes agents
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Rejoignez notre communauté d&apos;agents partenaires. Accédez à nos actualités en avant-première et bénéficiez d&apos;alertes promotionnelles exclusives.
            </p>
          </div>
          <ul className="text-gray-400 text-xs md:text-sm space-y-2 md:flex md:flex-row md:gap-4 md:justify-center md:space-y-0">
            {["Promotions exclusives", "Actualités en avant-première", "Échanges avec l'équipe", "Ressources de vente"].map((b) => (
              <li key={b} className="flex items-center justify-center md:justify-start gap-2">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-[#c4a74a] shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {facebookGroupUrl && (
            <div className="pt-2">
              <a
                href={facebookGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#c4a74a] text-black font-bold py-2.5 md:py-3 px-6 rounded-lg hover:bg-yellow-300 transition-all shadow-lg text-sm md:text-base"
              >
                <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                Rejoindre
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Partenariat Multisoleil */}
      <section
        className="w-full h-auto p-3 md:p-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/fond_Banniere.svg')" }}
      >
        <a href="https://www.espacemultisoleil.org" target="_blank" rel="noopener noreferrer">
          <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-12 items-center py-6 md:py-8">
            <OptimizedImage
              src="/images/gauche.svg"
              alt="Partenariat Nuance du Monde x Espace Multisoleil"
              width={500}
              height={400}
              className="w-full h-auto object-contain"
            />
            <div className="hidden md:block">
              <AnimatedBentoGrid />
            </div>
          </div>
        </a>
      </section>

      {/* Modal commande brochure */}
      {brochureOpen && (
        <div className="fixed inset-0 z-200 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setBrochureOpen(false)} />
          <div className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-lg overflow-hidden max-h-[90vh] md:max-h-none overflow-y-auto">
            <div className="bg-black px-4 md:px-6 py-3 md:py-4 sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-bold text-[#c4a74a] font-[Alro] uppercase">Commander la brochure</h3>
                <button onClick={() => setBrochureOpen(false)} className="text-white/60 hover:text-white p-1">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-1 bg-[#c4a74a]" />
            <form onSubmit={handleBrochureSubmit} className="p-4 md:p-6 space-y-3">
              {brError && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{brError}</div>}
              {brSuccess && <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">{brSuccess}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input type="text" value={brForm.first_name} onChange={e => setBrForm(f => ({ ...f, first_name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm" placeholder="Prénom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input type="text" value={brForm.last_name} onChange={e => setBrForm(f => ({ ...f, last_name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm" placeholder="Nom" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={brForm.email} onChange={e => setBrForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm" placeholder="votre@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agence</label>
                  <input type="text" value={brForm.agency_name} onChange={e => setBrForm(f => ({ ...f, agency_name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm" placeholder="Nom agence" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" value={brForm.phone} onChange={e => setBrForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm" placeholder="+1 514..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison</label>
                <textarea rows={2} value={brForm.address} onChange={e => setBrForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm resize-none" placeholder="Adresse complète" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                <input type="number" min="1" max="50" value={brForm.quantity} onChange={e => setBrForm(f => ({ ...f, quantity: e.target.value }))}
                  className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black text-sm" />
              </div>
              <button type="submit" disabled={brSubmitting}
                className="w-full bg-black text-[#c4a74a] font-bold py-3 rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50">
                {brSubmitting ? 'Envoi...' : 'Envoyer la demande'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Page principale ----------
export default function EspaceProPage() {
  const [proVideoUrl, setProVideoUrl] = useState('');
  const [facebookGroupUrl, setFacebookGroupUrl] = useState('');
  const { session, logout, isLoading } = useProfessional();
  const router = useRouter();

  // Charger l'URL de la vidéo pro et lien FB depuis les settings
  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data.success) {
        setProVideoUrl(data.data?.pro_video_url || '');
        setFacebookGroupUrl(data.data?.facebook_group_url || '');
      }
    }).catch(() => {});
  }, []);

  // Si pas connecté, rediriger vers la page d'accueil
  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      router.push('/?auth=1');
    }
  }, [isLoading, session?.isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // Double vérification au cas où la redirection n'a pas eu lieu
  if (!session?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <AuthenticatedView
      session={{ firstName: session.firstName, lastName: session.lastName, agencyName: session.agencyName }}
      proVideoUrl={proVideoUrl}
      facebookGroupUrl={facebookGroupUrl}
      onLogout={() => { logout(); router.push('/'); }}
    />
  );
}
