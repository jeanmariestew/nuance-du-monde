"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const valeurs = [
  {
    id: "01",
    title: "AUTHENTICITÉ",
    text: "Vivez des expériences authentiques en découvrant les cultures, les cuisines et les modes de vie locaux, partout dans le monde.",
    img: "https://www.lechotouristique.com/wp-content/uploads/2019/01/adobestock_295259074.jpg",
  },
  {
    id: "02",
    title: "DURABILITÉ",
    text: "Engagés envers un tourisme responsable, nous intégrons des pratiques durables pour préserver les destinations que nous aimons.",
    img: "https://www.deplacementspros.com/wp-content/uploads/2023/06/sustainable-business-travel-1.jpg",
  },
  {
    id: "03",
    title: "INNOVATION",
    text: "Nous repoussons sans cesse les limites pour vous offrir des voyages uniques et personnalisés, toujours à la pointe de l'innovation.",
    img: "https://images.squarespace-cdn.com/content/v1/66db9bee2dbfb64a179e38ba/1725676293737-AW6MOZGSCMG59PIHKIKX/unsplash-image-SvdOOFYjs-Y.jpg",
  },
  {
    id: "04",
    title: "FLEXIBILITÉ DE PAIEMENT",
    text: "Profitez de solutions de paiement flexibles, y compris des options de versements échelonnés pour faciliter votre projet de voyage.",
    img: "https://ibp.info6tm.fr/api/v1/files/5f915bce8fe56f06330b87a6/methodes/article/image.jpg",
  },
  {
    id: "05",
    title: "PASSION",
    text: "La passion pour le voyage est au cœur de notre société et nous voulons partager cette passion avec vous.",
    img: "https://cdn.hometogo.net/assets/media/pics/1920_600/611bcb58aa398.jpg",
  },
];


export default function ValuesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeValeur = valeurs[activeIndex];
  // Auto-advance images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 6);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToImage = (index: number) => {
    setActiveIndex(index);
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % valeurs.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + valeurs.length) % valeurs.length);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl grid gap-10 px-4 lg:grid-cols-[1.1fr_1fr]">
          {/* Left side - Values list */}
          <div className="">

          {valeurs.map((valeur, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={valeur.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={` text-left flex gap-4 transition ${
                  isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div className="min-w-[3rem] text-3xl font-bold text-[#f3c32c]">
                  {valeur.id}
                </div>
                <div
                  className={`p-4 rounded-lg w-full ${
                    isActive ? "bg-black text-white" : "bg-transparent"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold tracking-wide ${
                      isActive ? "text-[#f3c32c]" : "text-black"
                    }`}
                  >
                    {valeur.title}
                  </h3>
                  <p className="mt-2 text-md leading-relaxed">{valeur.text}</p>
                </div>
              </button>
            );
          })}
          </div>

          {/* Right side - Image Slider */}
          <div className="relative">
            <div className="relative h-96 lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
              <Image
                key={activeValeur.img}
                src={activeValeur.img}
                alt={activeValeur.title}
                fill
                className="object-cover rounded-xl transition-opacity duration-300"
              />
              {/* Floating navigation dots */}
              <div className="absolute left-6 top-1/2 transform flex flex-col -translate-y-1/2 space-y-3">
                {valeurs.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToImage(i)}
                    className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 hover:scale-110 ${
                      i === activeIndex
                        ? "bg-white"
                        : "bg-transparent hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Navigation arrows */}
              <div className="absolute left-4 top-1/3 space-y-34">
                <button
                  onClick={prevImage}
                  className="w-8 h-8 bg-white rounded border border-white/30 flex items-center justify-center text-yellow-600 hover:bg-white/30 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="w-8 h-8 bg-white rounded border border-white/30 flex items-center justify-center text-yellow-600 hover:bg-white/30 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    // <section className="py-16 bg-[#f9f9f9]">
    //   <div className="mx-auto max-w-6xl grid gap-10 px-4 lg:grid-cols-[1.1fr_1fr]">
    //     {/* Colonne gauche : liste cliquable */}
    //     <div className="space-y-6">
    //       {valeurs.map((valeur, index) => {
    //         const isActive = index === activeIndex;
    //         return (
    //           <button
    //             key={valeur.id}
    //             type="button"
    //             onClick={() => setActiveIndex(index)}
    //             className={`w-full text-left flex gap-4 transition ${
    //               isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
    //             }`}
    //           >
    //             <div className="min-w-[3rem] text-3xl font-bold text-[#f3c32c]">
    //               {valeur.id}
    //             </div>
    //             <div
    //               className={`p-4 rounded-lg w-full ${
    //                 isActive ? "bg-black text-white" : "bg-transparent"
    //               }`}
    //             >
    //               <h3
    //                 className={`text-lg font-semibold tracking-wide ${
    //                   isActive ? "text-[#f3c32c]" : "text-black"
    //                 }`}
    //               >
    //                 {valeur.title}
    //               </h3>
    //               <p className="mt-2 text-md leading-relaxed">
    //                 {valeur.text}
    //               </p>
    //             </div>
    //           </button>
    //         );
    //       })}
    //     </div>

    //     {/* Colonne droite : image active */}
    //     <div className="relative w-full min-h-[320px] lg:min-h-[480px]">
    //       <Image
    //         key={activeValeur.img}
    //         src={activeValeur.img}
    //         alt={activeValeur.title}
    //         fill
    //         className="object-cover rounded-xl transition-opacity duration-300"
    //       />
    //     </div>
    //   </div>
    // </section>
  );
}
