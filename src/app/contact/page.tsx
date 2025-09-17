export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 text-center">Nous contacter</h1>
        <p className="text-gray-600 text-center mb-8 sm:mb-10 md:mb-12 text-sm sm:text-base">
          Pour toute question ou demande, contactez-nous. Nous répondrons rapidement.
        </p>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Coordonnées</h2>
            <p className="text-gray-700 text-sm sm:text-base">1087 Laurier Ouest, QC H2V2L2</p>
            <p className="text-gray-700 text-sm sm:text-base">Montréal, Canada</p>
            <p className="text-gray-700 text-sm sm:text-base">Téléphone : 1-844-362-0555</p>
            <p className="text-gray-700 text-sm sm:text-base">Email : info@nuancedumonde.com</p>
          </div>
          <div className="border-t pt-4 sm:pt-5 md:pt-6 text-xs sm:text-sm text-gray-500">
            Les informations recueillies sont destinées à vous recontacter dans le cadre de votre demande.
          </div>
        </div>
      </div>
    </div>
  );
}
