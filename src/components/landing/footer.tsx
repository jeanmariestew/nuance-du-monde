import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1e293b] pt-16 pb-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex flex-col mb-4">
              <span className="text-white font-bold text-2xl tracking-wider">NUANCE</span>
              <span className="text-white font-medium text-sm tracking-widest -mt-1">DU MONDE</span>
            </Link>
            <p className="text-[#94a3b8] text-sm leading-relaxed max-w-sm">
              {"Le partenaire privilégié des agences de voyages pour la conception de séjours sur-mesure d'exception. Expertise, excellence et accompagnement dédié."}
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-[#475569] flex items-center justify-center hover:border-white transition-colors group"
              >
                <Facebook className="w-4 h-4 text-[#94a3b8] group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-[#475569] flex items-center justify-center hover:border-white transition-colors group"
              >
                <Instagram className="w-4 h-4 text-[#94a3b8] group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-[#475569] flex items-center justify-center hover:border-white transition-colors group"
              >
                <Linkedin className="w-4 h-4 text-[#94a3b8] group-hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full border border-[#475569] flex items-center justify-center hover:border-white transition-colors group"
              >
                <Youtube className="w-4 h-4 text-[#94a3b8] group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#c4a74a] text-xs uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#destinations" className="text-[#94a3b8] text-sm hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#94a3b8] text-sm hover:text-white transition-colors">
                  Services B2B
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#94a3b8] text-sm hover:text-white transition-colors">
                  Actualités
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[#c4a74a] text-xs uppercase tracking-wider mb-4">Légal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-[#94a3b8] text-sm hover:text-white transition-colors">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#94a3b8] text-sm hover:text-white transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#94a3b8] text-sm hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#334155] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#64748b] text-xs">
            <p>© 2026 NUANCE DU MONDE. INTELLIGENCE TECHNOLOGIQUE ET TOURISME SOLUTIONS INC. (ITTS).</p>
            <div className="flex gap-8">
              <span>PERMIS DU QUÉBEC N°703510.</span>
              <span>IATA TIDS N°96155474.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
