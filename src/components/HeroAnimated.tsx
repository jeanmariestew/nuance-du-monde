"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AVATAR_URL = (id: number) => `https://i.pravatar.cc/300?img=${id}`;

export default function HeroAnimated() {
  const avatars = useMemo(() => [12, 28, 45, 67], []);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, []);

  // Pour chaque slot, nous choisissons un avatar en rotation mais la position reste fixe
  const currentBySlot = [0, 1, 2, 3].map((offset) => avatars[(tick + offset) % avatars.length]);

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-stretch overflow-hidden">
      {/* Background principal */}
      <div className="absolute inset-0">
        <Image src="/images/homepage_banner.webp" alt="Nuance du Monde - Voyage sur mesure" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-16">
        {/* Colonne gauche */}
        <div className="text-white max-w-2xl">
          <h1 className="h1 font-extrabold">
            NUANCE DU MONDE
            <br />
            VOTRE SPÉCIALISTE DU
            <br />
            VOYAGE SUR MESURE
          </h1>

          <p className="mt-6 text-base md:text-lg text-gray-200">
            Créez avec nous votre voyage sur mesure, partout dans le monde. Nous vous faisons vivre des expériences
            authentiques et confortables, et ce, au meilleur prix du marché.
          </p>

          <div className="mt-6 flex gap-3 items-center">
            <input
              type="text"
              placeholder="Commencer la recherche…"
              className="w-full max-w-sm px-5 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-white/70 shadow-lg focus:outline-none"
            />
            <button className="px-5 py-3 rounded-lg bg-white text-gray-900 font-semibold shadow hover:brightness-95 transition-colors">Rechercher</button>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/30 relative ripple-container">
              <div className="ripple-wave"></div>
              <div className="ripple-wave"></div>
              <div className="ripple-wave"></div>
              <div className="absolute inset-1 rounded-full bg-[#d9a900] pulse-animation" />
            </div>
            <span className="text-sm">Explorer les thèmes et destinations</span>
          </div>
        </div>

        {/* Colonne droite: motif + slots fixes + lignes connectées */}
        <div className="relative h-[380px] md:h-[460px]">
          <div className="absolute right-0 top-6 w-[520px] h-[520px] max-w-full pointer-events-none select-none">
            {/* Motif de cercles (image) */}
            <Image src="/images/word-background.png" alt="ondas" fill className="object-contain opacity-90" priority />
          </div>

          {/* Lignes connectées SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 520">
            <motion.line
              x1="260" y1="260" x2="130" y2="130"
              stroke="white" strokeWidth="1" opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.line
              x1="260" y1="260" x2="390" y2="100"
              stroke="white" strokeWidth="1" opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.line
              x1="260" y1="260" x2="400" y2="400"
              stroke="white" strokeWidth="1" opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
            />
            {/* Ajoute plus de lignes si nécessaire pour matcher le design */}
          </svg>

          {/* Slots fixes */}
          <div className="absolute inset-0">
            {/* Slot central */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Slot size="lg" avatarId={currentBySlot[0]} />
            </div>
            {/* Slot haut-gauche */}
            <div className="absolute -left-8 top-10">
              <Slot size="md" avatarId={currentBySlot[1]} />
            </div>
            {/* Slot haut-droit */}
            <div className="absolute right-10 top-0">
              <Slot size="sm" avatarId={currentBySlot[2]} />
            </div>
            {/* Slot bas-droit */}
            <div className="absolute right-2 bottom-4">
              <Slot size="md" avatarId={currentBySlot[3]} />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

function Slot({ size, avatarId }: { size: "sm" | "md" | "lg"; avatarId: number }) {
  const dims = size === "lg" ? "w-28 h-28 md:w-32 md:h-32" : size === "md" ? "w-24 h-24" : "w-20 h-20";
  return (
    <div className={`relative ${dims} rounded-2xl overflow-hidden ring-2 ring-white/60 shadow-2xl bg-white`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={avatarId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
          <Image src={AVATAR_URL(avatarId)} alt="avatar" fill className="object-cover" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
