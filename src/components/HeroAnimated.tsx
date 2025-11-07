"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function HeroAnimated() {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [tick, setTick] = useState(0);

  // Charger dynamiquement les images depuis l'API
  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch('/api/animation-images');
        const data = await response.json();
        if (data.images && data.images.length > 0) {
          setAvatars(data.images);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
      }
    };
    
    loadImages();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, []);

  // Pour chaque slot, nous choisissons un avatar en rotation mais la position reste fixe
  const currentBySlot = avatars.length > 0 
    ? [0, 1, 2, 3].map((offset) => avatars[(tick + offset) % avatars.length])
    : [];

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
          <h1 className="h1 font-extrabold !text-4xl !tracking-wider font-[Alro]">
            NUANCE DU MONDE
            VOTRE SPÉCIALISTE DU
            VOYAGE SUR MESURE
          </h1>

          <p className="mt-6 text-base md:text-lg text-gray-200">
            Créez avec nous votre voyage sur mesure, partout dans le monde. Nous vous faisons vivre des expériences
            authentiques et confortables, et ce, au meilleur prix du marché.
          </p>

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

          {/* Slots animés avec rotation cyclique */}
          {avatars.length > 0 && (
          <div className="absolute inset-0">
            {/* Position A (central) */}
            <motion.div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{ 
                x: tick % 4 === 0 ? 0 : tick % 4 === 1 ? -180 : tick % 4 === 2 ? 140 : 130,
                y: tick % 4 === 0 ? 0 : tick % 4 === 1 ? 120 : tick % 4 === 2 ? -10 : 120
              }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            >
              <Slot size={tick % 4 === 0 ? "lg" : tick % 4 === 1 ? "md" : tick % 4 === 2 ? "sm" : "md"} avatarId={currentBySlot[(0 + tick) % 4]} />
            </motion.div>
            {/* Position B (haut-gauche) */}
            <motion.div 
              className="absolute -left-8 top-10"
              animate={{ 
                x: tick % 4 === 0 ? 0 : tick % 4 === 1 ? 0 : tick % 4 === 2 ? 280 : 130,
                y: tick % 4 === 0 ? 0 : tick % 4 === 1 ? -120 : tick % 4 === 2 ? -120 : 120
              }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            >
              <Slot size={tick % 4 === 0 ? "md" : tick % 4 === 1 ? "lg" : tick % 4 === 2 ? "md" : "sm"} avatarId={currentBySlot[(1 + tick) % 4]} />
            </motion.div>
            {/* Position C (haut-droit) */}
            <motion.div 
              className="absolute right-10 top-0"
              animate={{ 
                x: tick % 4 === 0 ? 0 : tick % 4 === 1 ? 140 : tick % 4 === 2 ? 0 : -280,
                y: tick % 4 === 0 ? 0 : tick % 4 === 1 ? 0 : tick % 4 === 2 ? 120 : 120
              }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            >
              <Slot size={tick % 4 === 0 ? "sm" : tick % 4 === 1 ? "sm" : tick % 4 === 2 ? "lg" : "md"} avatarId={currentBySlot[(2 + tick) % 4]} />
            </motion.div>
            {/* Position D (bas-droit) */}
            <motion.div 
              className="absolute right-2 bottom-4"
              animate={{ 
                x: tick % 4 === 0 ? 0 : tick % 4 === 1 ? -130 : tick % 4 === 2 ? -140 : 0,
                y: tick % 4 === 0 ? 0 : tick % 4 === 1 ? -120 : tick % 4 === 2 ? 0 : -120
              }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            >
              <Slot size={tick % 4 === 0 ? "md" : tick % 4 === 1 ? "md" : tick % 4 === 2 ? "md" : "lg"} avatarId={currentBySlot[(3 + tick) % 4]} />
            </motion.div>
          </div>
          )}
        </div>
      </div>

    </section>
  );
}

function Slot({ size, avatarId }: { size: "sm" | "md" | "lg"; avatarId: string }) {
  const dims = size === "lg" ? "w-28 h-28 md:w-32 md:h-32" : size === "md" ? "w-24 h-24" : "w-20 h-20";
  return (
    <motion.div 
      className={`relative ${dims} rounded-2xl overflow-hidden ring-2 ring-white/60 shadow-2xl bg-white`}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div 
          key={avatarId} 
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }} 
          className="absolute inset-0"
        >
          <Image src={avatarId} alt="avatar" fill className="object-cover" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
