import Image from "next/image";

export default function TravelTypesHero() {
  return (
    <section className="relative text-white overflow-hidden">
      <div className="w-full h-full">
        <div className="grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-0 h-full">
          {/* Colonne gauche - Texte avec fond texturé */}
          <div className="relative flex flex-col justify-center px-8 lg:px-16">
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <Image
                src="/images/texture.png"
                alt=""
                fill
                className="object-cover mix-blend-overlay"
                priority
              />
            </div>
            {/* Icône circulaire exacte comme la capture */}
            <div className="absolute top-8 left-8 w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center ripple-container">
              <div className="ripple-wave"></div>
              <div className="ripple-wave"></div>
              <div className="ripple-wave"></div>
              <div className="w-4 h-4 bg-[#d9a900] rounded-full pulse-animation"></div>
            </div>

            <div className="mt-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white tracking-wide">
                TYPE DE VOYAGE
              </h2>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-md">
                Que vous soyez en groupe, en solo ou en voyage d&apos;affaires, nos
                différents types de voyage vous invitent à une expérience
                enrichissante et taillée sur mesure.
              </p>
            </div>
          </div>

          {/* Colonne droite - Image pleine hauteur */}
          <div className="relative h-full">
            <Image
              src="/images/a-la-une-3.jpg"
              alt="Type de voyage - Vue urbaine"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
