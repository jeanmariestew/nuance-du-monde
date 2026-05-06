"use client";

import { useState, useEffect } from "react";
import { X, UserRound, Briefcase, PlayCircle } from "lucide-react";
import ProfessionalAuthModal from "./ProfessionalAuthModal";

function VideoPlayer({ url, className }: { url: string; className?: string }) {
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
  const isVimeo   = url.includes("vimeo.com");

  if (isYoutube) {
    const id = url.includes("youtu.be/")
      ? url.split("youtu.be/")[1]?.split("?")[0]
      : (() => { try { return new URL(url).searchParams.get("v"); } catch { return null; } })();
    if (!id) return null;
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isVimeo) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return (
      <iframe
        src={`https://player.vimeo.com/video/${id}?autoplay=1`}
        className={className}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return <video src={url} controls autoPlay className={className} />;
}

interface BtoBtoCProps {
  proVideoUrl?: string;
  particulierVideoUrl?: string;
}

export default function BtoBtoCSection({ proVideoUrl, particulierVideoUrl }: BtoBtoCProps) {
  const [modal, setModal] = useState<null | "particulier" | "agent">(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  return (
    <>
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black font-[Alro] uppercase mb-4">
              Bienvenue chez Nuance du Monde
            </h2>
            <p className="text-gray-500 text-lg">Choisissez votre profil pour découvrir nos offres</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Particulier */}
            <button
              onClick={() => setModal("particulier")}
              className="group relative bg-black text-white rounded-2xl overflow-hidden p-10 flex flex-col items-center gap-5 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-[#00BFFF]"
            >
              <div className="w-20 h-20 rounded-full bg-[#00BFFF]/20 flex items-center justify-center group-hover:bg-[#00BFFF]/30 transition-colors">
                <UserRound className="w-10 h-10 text-[#00BFFF]" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-[Alro] uppercase mb-2">Je suis un particulier</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Découvrez nos destinations et voyages pour vos vacances en famille, en couple ou entre amis.
                </p>
              </div>
              {particulierVideoUrl && (
                <div className="flex items-center gap-2 text-[#00BFFF] text-sm font-medium">
                  <PlayCircle className="w-4 h-4" />
                  Voir la vidéo
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-br from-[#00BFFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>

            {/* Agent */}
            <button
              onClick={() => setModal("agent")}
              className="group relative bg-[#FFFF00] text-black rounded-2xl overflow-hidden p-10 flex flex-col items-center gap-5 hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-black"
            >
              <div className="w-20 h-20 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                <Briefcase className="w-10 h-10 text-black" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-[Alro] uppercase mb-2">Je suis un agent de voyage</h3>
                <p className="text-black/60 text-sm leading-relaxed">
                  Accédez à notre espace dédié : offres exclusives, brochures, outils et support professionnel.
                </p>
              </div>
              {proVideoUrl && (
                <div className="flex items-center gap-2 text-black/70 text-sm font-medium">
                  <PlayCircle className="w-4 h-4" />
                  Voir la vidéo
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Particulier */}
      {modal === "particulier" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-black px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#00BFFF] font-[Alro] uppercase">
                  Espace Particuliers
                </h3>
                <p className="text-white/60 text-sm">Des voyages pensés pour vous</p>
              </div>
              <button onClick={() => setModal(null)} className="text-white/60 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="h-1 bg-[#00BFFF]" />
            <div className="p-6">
              {particulierVideoUrl ? (
                <div className="rounded-xl overflow-hidden aspect-video mb-6">
                  <VideoPlayer url={particulierVideoUrl} className="w-full h-full border-none" />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center mb-6">
                  <UserRound className="w-16 h-16 text-[#00BFFF] mx-auto mb-4" />
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Explorez nos destinations uniques, nos thèmes de voyage et nos offres
                    soigneusement sélectionnées pour vous offrir une expérience inoubliable.
                  </p>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={() => setModal(null)}
                  className="bg-black text-white font-bold py-3 px-10 rounded-lg hover:bg-gray-900 transition-all"
                >
                  Explorer les voyages
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Agent */}
      {modal === "agent" && !showAuthModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-black px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#FFFF00] font-[Alro] uppercase">
                  Espace Agents de voyage
                </h3>
                <p className="text-white/60 text-sm">Votre espace professionnel dédié</p>
              </div>
              <button onClick={() => setModal(null)} className="text-white/60 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="h-1 bg-[#FFFF00]" />
            <div className="p-6">
              {proVideoUrl ? (
                <div className="rounded-xl overflow-hidden aspect-video mb-6">
                  <VideoPlayer url={proVideoUrl} className="w-full h-full border-none" />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center mb-6">
                  <Briefcase className="w-16 h-16 text-black mx-auto mb-4" />
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Un espace exclusif a été créé pour vous. Accédez à nos offres professionnelles,
                    brochures, groupes d&apos;entraide et ressources de vente dédiées aux agents de voyage partenaires.
                  </p>
                  <p className="text-gray-500 text-sm mt-3">
                    Inscrivez-vous ou connectez-vous pour accéder à l&apos;espace agents.
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/inscription-agents"
                  className="flex-1 bg-[#FFFF00] text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-300 transition-all text-center"
                  onClick={() => setModal(null)}
                >
                  Je m&apos;inscris
                </a>
                <button
                  onClick={() => { setModal(null); setShowAuthModal(true); }}
                  className="flex-1 bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-all"
                >
                  Je me connecte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAuthModal && (
        <ProfessionalAuthModal
          isOpen={true}
          onClose={() => setShowAuthModal(false)}
          redirectAfterAuth="/espace-pro"
        />
      )}
    </>
  );
}
