// app/qui-sommes-nous/page.tsx
"use client";

import ValuesSection from "@/components/ValuesSection";
import Image from "next/image";


export default function QuiSommesNousPage() {

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

      <ValuesSection />
    </main>
  );
}
