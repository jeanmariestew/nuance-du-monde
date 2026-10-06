"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Titre du circuit, transmis au formulaire via ?circuit=...
  circuit?: string;
}

// Popup affichée hors de l'espace Agents : le visiteur choisit lui-même le bon
// formulaire plutôt que de devoir se connecter d'abord pour y accéder.
export default function QuoteRequestModal({ isOpen, onClose, circuit }: QuoteRequestModalProps) {
  if (!isOpen) return null;

  const suffix = circuit ? `?circuit=${encodeURIComponent(circuit)}` : "";

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6 sm:p-8 text-center space-y-5">
          <h2 className="text-xl font-bold text-gray-900">Vous êtes...</h2>
          <p className="text-sm text-gray-600">
            Le formulaire diffère selon votre profil. Choisissez l&apos;option qui vous correspond.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href={`/devis-personnalise${suffix}`}
              onClick={onClose}
              className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Demande de devis particulier
            </Link>
            <Link
              href={`/devis-professionnel${suffix}`}
              onClick={onClose}
              className="w-full bg-[#d9a900] text-white font-semibold py-3 rounded-lg hover:bg-[#c49800] transition-colors"
            >
              Demande de devis conseiller
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
