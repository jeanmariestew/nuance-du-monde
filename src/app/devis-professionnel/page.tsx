"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useProfessional } from "@/contexts/ProfessionalContext";

export default function DevisProfessionnelPage() {
  const { session, isLoading } = useProfessional();
  const router = useRouter();

  // Page réservée aux agents connectés : redirige vers l'accueil avec la modal
  // de connexion si aucune session active (même logique que /espace-pro et /brochure_2026)
  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      router.push("/?auth=1");
    }
  }, [isLoading, session?.isAuthenticated, router]);

  if (isLoading || !session?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Demande de devis professionnel
            </h1>
            <p className="text-lg text-gray-600">
              Remplissez ce formulaire pour soumettre une demande de devis pour
              votre client, {session.firstName}.
            </p>
          </div>

          <div className="w-full">
            <iframe
              src="https://api.leadconnectorhq.com/widget/survey/BCeSe6pSCdVCivgNKezY"
              style={{ border: "none", width: "100%" }}
              scrolling="no"
              id="BCeSe6pSCdVCivgNKezY"
              title="survey"
              data-cookie-consent="true"
              data-cookie-consent-provider="auto"
            />
            <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
          </div>

          {/* Contact info */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Vous préférez nous appeler ?
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              <strong>Téléphone :</strong> 1-844-362-0555 (Numéro gratuit)
            </p>
            <p className="text-lg text-gray-600">
              <strong>Email :</strong> info@nuancedumonde.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
