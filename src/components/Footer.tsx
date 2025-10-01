import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div>
      <div className="relative w-full p-5 h-[450px] bg-black">
        <Image
          src="/images/fond_position.png"
          alt="Background themes"
          fill
          className="object-cover"
        />
        <div className=" backdrop-blur-[2px] rounded-2xl bg-white/10 h-[400px]">
          <Image
            src="/images/positionnement.svg"
            alt="Background themes"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <footer className="bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image
            src="/images/footer_bg.png"
            alt=""
            fill
            className="object-left"
          />
        </div>
        <div className="relative container mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Logo */}
            <div className="md:col-span-1 flex justify-center md:justify-start mb-4 md:mb-0">
              <Image
                src="/images/logo.png"
                alt="Nuance du Monde"
                width={200}
                height={80}
                className="h-auto"
                priority
              />
            </div>

            {/* À propos de nous */}
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white">
                À propos de nous
              </h3>
              <ul className="space-y-2.5 md:space-y-3 text-gray-300 text-sm md:text-base">
                <li>
                  <Link
                    href="/pages/qui-sommes-nous"
                    className="hover:text-white transition-colors"
                  >
                    Qui sommes nous
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/aide"
                    className="hover:text-white transition-colors"
                  >
                    Aide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/avis-client"
                    className="hover:text-white transition-colors"
                  >
                    Avis client
                  </Link>
                </li>
              </ul>
            </div>

            {/* Termes et conditions */}
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white">
                Termes et conditions
              </h3>
              <ul className="space-y-2.5 md:space-y-3 text-gray-300 text-sm md:text-base">
                <li>
                  <Link
                    href="/pages/conditions-generales-vente"
                    className="hover:text-white transition-colors"
                  >
                    Conditions générales de ventes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/conditions-generales-utilisation"
                    className="hover:text-white transition-colors"
                  >
                    Conditions générales d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/politique-confidentialite"
                    className="hover:text-white transition-colors"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>

            {/* Réseaux sociaux */}
            <div className="px-4 md:px-0">
              <div className="flex flex-col space-y-3 md:space-y-4 max-w-sm mx-auto md:max-w-none">
                <a
                  href="https://facebook.com/nuance_du_monde"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-white/60 hover:bg-gray-100 px-4 py-2.5 md:py-3 rounded-full transition-colors text-black text-sm md:text-base"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
                    f
                  </div>
                  <span>Facebook</span>
                </a>
                <a
                  href="https://instagram.com/nuance_du_monde"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-white/60 hover:bg-gray-100 px-4 py-2.5 md:py-3 rounded-full transition-colors text-black text-sm md:text-base"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
                    @
                  </div>
                  <span>Instagram</span>
                </a>
                <a
                  href="https://linkedin.com/nuance-du_monde"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-white/60 hover:bg-gray-100 px-4 py-2.5 md:py-3 rounded-full transition-colors text-black text-sm md:text-base"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
                    in
                  </div>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://youtube.com/nuance_du_monde"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-white/60 hover:bg-gray-100 px-4 py-2.5 md:py-3 rounded-full transition-colors text-black text-sm md:text-base"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
                    ▶
                  </div>
                  <span>Youtube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section copyright et informations légales */}
          <div className="border-t border-white/20 mt-12 md:mt-16 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-xs md:text-sm text-gray-300">
              <div className="text-center md:text-left">
                <p className="mb-2">
                  L&apos;adresse : 1087 Laurier Ouest, QC H2V2L2, Montréal,
                  Canada
                </p>
                <p className="mb-2">
                  Téléphone : 1-844-362-0555 (Numéro gratuit)
                </p>
                <p>Adresse courriel : info@nuancedumonde.com</p>
              </div>
              <div className="text-center md:text-right">
                <p className="mb-2">
                  2024 Nuance du Monde.{" "}
                  <strong>
                    INTELLIGENCE TECHNOLOGIQUE ET TOURISME SOLUTIONS INC.
                    (ITTS).
                  </strong>
                </p>
                <p className="mb-2">
                  Membre de l&apos;association des Agences réceptives et des
                  forfaitistes du Québec. Titulaire du permis du Québec
                  N°703510.
                </p>
                <p>Code d&apos;identification IATA TIDS N°96155474.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
