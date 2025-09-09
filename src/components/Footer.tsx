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
        <div className="relative container mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <Image
                src="/images/logo.png"
                alt="Nuance du Monde"
                width={200}
                height={80}
                className="mb-6"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6 text-white">
                À propos de nous
              </h3>
              <ul className="space-y-3 text-gray-300">
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

            <div>
              <h3 className="text-xl font-bold mb-6 text-white">
                Termes et conditions
              </h3>
              <ul className="space-y-3 text-gray-300">
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

            <div>
              <div className="flex flex-col space-y-4">
                <a
                  href="https://facebook.com/nuance_du_monde"
                  className="flex items-center space-x-3 bg-white/60 hover:bg-gray-100 px-4 py-3 rounded-full transition-colors text-black"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black text-sm font-bold">
                    f
                  </div>
                  <span>Facebook</span>
                </a>
                <a
                  href="https://instagram.com/nuance_du_monde"
                  className="flex items-center space-x-3 bg-white/60 hover:bg-gray-100 px-4 py-3 rounded-full transition-colors text-black"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black text-sm font-bold">
                    @
                  </div>
                  <span>Instagram</span>
                </a>
                <a
                  href="https://linkedin.com/nuance-du_monde"
                  className="flex items-center space-x-3 bg-white/60 hover:bg-gray-100 px-4 py-3 rounded-full transition-colors text-black"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black text-sm font-bold">
                    in
                  </div>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://youtube.com/nuance_du_monde"
                  className="flex items-center space-x-3 bg-white/60  hover:bg-gray-100 px-4 py-3 rounded-full transition-colors text-black"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black text-sm font-bold">
                    ▶
                  </div>
                  <span>Youtube</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-16 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300">
              <div>
                <p className="mb-2">
                  L&apos;adresse : 1087 Laurier Ouest, QC H2V2L2, Montréal,
                  Canada
                </p>
                <p className="mb-2">
                  Téléphone : 1-844-362-0555 (Numéro gratuit)
                </p>
                <p>Adresse courriel : info@nuancedumonde.com</p>
              </div>
              <div className="text-right">
                <p className="mb-2">
                  {" "}
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
