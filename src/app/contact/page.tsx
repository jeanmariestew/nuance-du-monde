export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Nous contacter</h1>
        <p className="text-gray-600 text-center mb-12">
          Pour toute question ou demande, contactez-nous. Nous répondrons rapidement.
        </p>

        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Coordonnées</h2>
            <p className="text-gray-700">1087 Laurier Ouest, QC H2V2L2</p>
            <p className="text-gray-700">Montréal, Canada</p>
            <p className="text-gray-700">Téléphone : 1-844-362-0555</p>
            <p className="text-gray-700">Email : info@nuancedumonde.com</p>
          </div>
          <div className="border-t pt-6 text-sm text-gray-500">
            Les informations recueillies sont destinées à vous recontacter dans le cadre de votre demande.
          </div>
        </div>
      </div>
    </div>
  );
}
