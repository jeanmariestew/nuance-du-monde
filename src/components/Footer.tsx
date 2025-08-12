import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="hero-radial h-full w-full" />
      </div>
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="inline-block w-8 h-8 rounded-full bg-gray-200 mr-3" />
              <span className="font-semibold text-white">Nuance du Monde</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              1087 Laurier Ouest, QC H2V2L2, Montréal, Canada
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">À propos de nous</h3>
            <ul className="space-y-2">
              <li><Link href="/pages/qui-sommes-nous" className="hover:text-white">Qui sommes nous</Link></li>
              <li><Link href="/pages/aide" className="hover:text-white">Aide</Link></li>
              <li><Link href="/pages/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/avis-client" className="hover:text-white">Avis client</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Termes et conditions</h3>
            <ul className="space-y-2">
              <li><Link href="/pages/conditions-generales-vente" className="hover:text-white">Conditions générales de vente</Link></li>
              <li><Link href="/pages/conditions-generales-utilisation" className="hover:text-white">Conditions générales d'utilisation</Link></li>
              <li><Link href="/pages/politique-confidentialite" className="hover:text-white">Politique de confidentialité</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Nous joindre</h3>
            <p className="text-sm">Téléphones : 1-844-362-0555</p>
            <p className="text-sm">Courriel : info@nuancedumonde.com</p>
            <div className="flex space-x-3 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-white">FB</a>
              <a href="#" aria-label="Instagram" className="hover:text-white">IG</a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white">IN</a>
              <a href="#" aria-label="YouTube" className="hover:text-white">YT</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Nuance du Monde. <strong>INTELLIGENCE TECHNOLOGIQUE ET TOURISME SOLUTIONS INC. (ITTS)</strong>.</p>
          <p className="mt-2">
            Membre de l’association des Agences réceptives et des forfaitistes du Québec. Titulaire du permis du Québec N°703510. IATA TIDS N°96155474.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

