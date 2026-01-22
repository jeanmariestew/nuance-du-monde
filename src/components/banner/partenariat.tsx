"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const IMAGES = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  src: `/Bannière - Partenariat Nuance du Monde x Espace Multisoleil/Rectangle ${i + 1}.png`,

  alt: `Grid Item ${i}`,
}));

const LAYOUTS = [
  // 1. FOCUS sur Image 2 (Ton original)
  [
    "col-span-1 row-span-1 col-start-1 row-start-2",
    "col-span-3 row-span-3 col-start-2 row-start-1", // Grande (Index 1)
    "col-span-1 row-span-1 col-start-5 row-start-1",
    "col-span-2 row-span-2 col-start-5 row-start-2",
    "col-span-1 row-span-1 col-start-7 row-start-3",
    "col-span-1 row-span-1 col-start-2 row-start-4",
    "col-span-2 row-span-2 col-start-3 row-start-4",
    "col-span-1 row-span-1 col-start-5 row-start-4",
  ],
  // 2. FOCUS sur Image 3 (Index 2) - Le focus passe en haut à droite
  [
    "col-span-1 row-span-1 col-start-1 row-start-2",
    "col-span-2 row-span-2 col-start-2 row-start-2", 
    "col-span-3 row-span-3 col-start-4 row-start-1", // Grande (Index 2)
    "col-span-1 row-span-1 col-start-2 row-start-1",
    "col-span-1 row-span-1 col-start-7 row-start-4",
    "col-span-1 row-span-1 col-start-1 row-start-4",
    "col-span-2 row-span-2 col-start-2 row-start-4",
    "col-span-1 row-span-1 col-start-5 row-start-4",
  ],
  // 3. FOCUS sur Image 4 (Index 3) - Le focus descend à droite
  [
    "col-span-1 row-span-1 col-start-1 row-start-1",
    "col-span-1 row-span-1 col-start-2 row-start-1",
    "col-span-2 row-span-2 col-start-3 row-start-1",
    "col-span-3 row-span-3 col-start-5 row-start-2", // Grande (Index 3)
    "col-span-1 row-span-1 col-start-1 row-start-2",
    "col-span-2 row-span-2 col-start-2 row-start-3",
    "col-span-1 row-span-1 col-start-1 row-start-4",
    "col-span-1 row-span-1 col-start-4 row-start-4",
  ],
  // 4. FOCUS sur Image 5 (Index 4) - Le focus est centré/bas
  [
    "col-span-2 row-span-2 col-start-1 row-start-1",
    "col-span-1 row-span-1 col-start-3 row-start-1",
    "col-span-1 row-span-1 col-start-3 row-start-2",
    "col-span-1 row-span-1 col-start-4 row-start-1",
    "col-span-3 row-span-3 col-start-4 row-start-2", // Grande (Index 4)
    "col-span-1 row-span-1 col-start-1 row-start-3",
    "col-span-2 row-span-2 col-start-2 row-start-3",
    "col-span-1 row-span-1 col-start-7 row-start-1",
  ],
  // 5. FOCUS sur Image 6 (Index 5) - Le focus passe en bas à gauche
  [
    "col-span-1 row-span-1 col-start-7 row-start-1",
    "col-span-1 row-span-1 col-start-6 row-start-2",
    "col-span-1 row-span-1 col-start-1 row-start-1",
    "col-span-2 row-span-2 col-start-4 row-start-1",
    "col-span-2 row-span-2 col-start-4 row-start-3",
    "col-span-3 row-span-3 col-start-1 row-start-2", // Grande (Index 5)
    "col-span-1 row-span-1 col-start-6 row-start-3",
    "col-span-1 row-span-1 col-start-7 row-start-4",
  ],
  // 6. FOCUS sur Image 7 (Index 6) - Le focus est en bas au centre
  [
    "col-span-2 row-span-2 col-start-1 row-start-1",
    "col-span-1 row-span-1 col-start-3 row-start-1",
    "col-span-1 row-span-1 col-start-3 row-start-2",
    "col-span-2 row-span-2 col-start-5 row-start-1",
    "col-span-1 row-span-1 col-start-1 row-start-3",
    "col-span-1 row-span-1 col-start-7 row-start-3",
    "col-span-3 row-span-3 col-start-2 row-start-3", // Grande (Index 6)
    "col-span-1 row-span-1 col-start-5 row-start-4",
  ],
  // 7. FOCUS sur Image 8 (Index 7) - Le focus est à droite
  [
    "col-span-1 row-span-1 col-start-1 row-start-1",
    "col-span-2 row-span-2 col-start-2 row-start-1",
    "col-span-1 row-span-1 col-start-1 row-start-2",
    "col-span-1 row-span-1 col-start-4 row-start-1",
    "col-span-1 row-span-1 col-start-4 row-start-2",
    "col-span-1 row-span-1 col-start-1 row-start-4",
    "col-span-2 row-span-2 col-start-2 row-start-3",
    "col-span-3 row-span-3 col-start-5 row-start-2", // Grande (Index 7)
  ],
  // 8. FOCUS sur Image 1 (Index 0) - Le focus revient en haut gauche
  [
    "col-span-3 row-span-3 col-start-1 row-start-1", // Grande (Index 0)
    "col-span-2 row-span-2 col-start-4 row-start-1",
    "col-span-1 row-span-1 col-start-6 row-start-1",
    "col-span-1 row-span-1 col-start-4 row-start-3",
    "col-span-1 row-span-1 col-start-5 row-start-3",
    "col-span-1 row-span-1 col-start-7 row-start-2",
    "col-span-2 row-span-2 col-start-1 row-start-4",
    "col-span-1 row-span-1 col-start-3 row-start-4",
  ],
];

export default function AnimatedFluidGrid() {
  const [activeLayoutIndex, setActiveLayoutIndex] = useState(7);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLayoutIndex((prev) => (prev + 1) % LAYOUTS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentLayout = LAYOUTS[activeLayoutIndex];

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-7 w-[750px] h-[300px] lg:w-[850px] lg:h-[590px] gap-1 grid-flow-dense">
        {IMAGES.map((img, index) => {
          const spanClass = currentLayout[index];
          const isBig = spanClass.includes("col-span-2");

          return (
            <motion.div
              key={img.id}
              layout
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className={`
                relative overflow-hidden rounded-2xl cursor-pointer
                ${spanClass} 
                ${isBig ? "z-10 shadow-2xl shadow-white/10" : "z-0"}
              `}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100%, 100%"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
