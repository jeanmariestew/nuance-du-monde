// app/qui-sommes-nous/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

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

export default function QuiSommesNousPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeValeur = valeurs[activeIndex];

  return (
    <main>
      {/* --- HERO (même image que la page) --- */}
      <section className="relative">
        <div className="relative h-[300px] w-full">
          <Image
            src="https://web.archive.org/web/20250614165813im_/https://blogs.nuancedumonde.com/wp-content/uploads/2024/08/view-hand-holding-magnifying-glass2.jpg"
            alt="Qui sommes-nous ?"
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      {/* --- QUI SOMMES-NOUS ? --- */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-4xl font-bold uppercase text-[#d9a900]">
            Qui sommes-nous ?
          </h2>
          <p className="mt-6 text-md leading-relaxed font-[Quicksand]">
            Le voyage est pour nous le 5ème élément de la vie. Sa valeur dépasse
            le cadre de simples services consommables : le voyage est le sens
            même de ce qui nous unit tous sur cette magnifique planète. Chaque
            voyage est une symphonie de découvertes à composer selon vos envies.
            C&apos;est pourquoi, nous nous engageons à créer des voyages à la
            carte, en groupe et en individuel, à travers le monde.
          </p>
        </div>
      </section>

      {/* --- VALEURS AVEC IMAGE QUI CHANGE --- */}
      <section className="py-16 bg-[#f9f9f9]">
        <div className="mx-auto max-w-6xl grid gap-10 px-4 lg:grid-cols-[1.1fr_1fr]">
          {/* Colonne gauche : liste cliquable */}
          <div className="space-y-6">
            {valeurs.map((valeur, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={valeur.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left flex gap-4 transition ${
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
                    <p className="mt-2 text-md leading-relaxed">
                      {valeur.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Colonne droite : image active */}
          <div className="relative w-full min-h-[320px] lg:min-h-[480px]">
            <Image
              key={activeValeur.img}
              src={activeValeur.img}
              alt={activeValeur.title}
              fill
              className="object-cover rounded-xl transition-opacity duration-300"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
