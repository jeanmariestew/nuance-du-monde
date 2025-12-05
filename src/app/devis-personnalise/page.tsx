"use client";

import { Suspense } from "react";

function DemanderDevisForm() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Demander un devis
            </h1>
            <p className="text-lg text-gray-600">
              Remplissez ce formulaire et nous vous contacterons dans les plus
              brefs délais pour créer votre voyage sur mesure.
            </p>
          </div>
          <div className="w-full">
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/lf19NnexU5Xi1qiGVVJG"
              id="inline-lf19NnexU5Xi1qiGVVJG"
              style={{ width: "100%", height: "5650px", border: "none", borderRadius: 3 }}
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Formulaire de demande de devis "
              data-height="5055"
              data-layout-iframe-id="inline-lf19NnexU5Xi1qiGVVJG"
              data-form-id="lf19NnexU5Xi1qiGVVJG"
              title="Formulaire de demande de devis "
            />
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

export default function DemanderDevisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <DemanderDevisForm />
    </Suspense>
  );
}
