'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Destination, TravelType, TravelTheme } from '@/types';

function DemanderDevisForm() {
  const searchParams = useSearchParams();
  const destinationSlug = searchParams.get('destination');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    destination_id: '',
    travel_theme_id: '',
    travel_type_id: '',
    departure_date: '',
    return_date: '',
    number_of_travelers: '',
    budget_range: '',
    special_requests: ''
  });

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [travelThemes, setTravelThemes] = useState<TravelTheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Charger les données pour les sélecteurs
    const fetchData = async () => {
      try {
        const [destRes, typesRes, themesRes] = await Promise.all([
          fetch('/api/destinations?active=true'),
          fetch('/api/travel-types?active=true'),
          fetch('/api/travel-themes?active=true')
        ]);

        const [destData, typesData, themesData] = await Promise.all([
          destRes.json(),
          typesRes.json(),
          themesRes.json()
        ]);

        if (destData.success) {
          setDestinations(destData.data);
          
          // Si une destination est spécifiée dans l'URL, la présélectionner
          if (destinationSlug) {
            const destination = destData.data.find((d: Destination) => d.slug === destinationSlug);
            if (destination) {
              setFormData(prev => ({ ...prev, destination_id: destination.id.toString() }));
            }
          }
        }
        if (typesData.success) setTravelTypes(typesData.data);
        if (themesData.success) setTravelThemes(themesData.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchData();
  }, [destinationSlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          destination_id: formData.destination_id ? parseInt(formData.destination_id) : null,
          travel_theme_id: formData.travel_theme_id ? parseInt(formData.travel_theme_id) : null,
          travel_type_id: formData.travel_type_id ? parseInt(formData.travel_type_id) : null,
          number_of_travelers: formData.number_of_travelers ? parseInt(formData.number_of_travelers) : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message);
        // Réinitialiser le formulaire
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          destination_id: '',
          travel_theme_id: '',
          travel_type_id: '',
          departure_date: '',
          return_date: '',
          number_of_travelers: '',
          budget_range: '',
          special_requests: ''
        });
      } else {
        setIsSuccess(false);
        setMessage(data.error);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Demander un devis</h1>
            <p className="text-lg text-gray-600">
              Remplissez ce formulaire et nous vous contacterons dans les plus brefs délais 
              pour créer votre voyage sur mesure.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Détails du voyage */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Détails du voyage</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="destination_id" className="block text-sm font-medium text-gray-700 mb-2">
                      Destination
                    </label>
                    <select
                      id="destination_id"
                      name="destination_id"
                      value={formData.destination_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner une destination</option>
                      {destinations.map((destination) => (
                        <option key={destination.id} value={destination.id}>
                          {destination.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="travel_type_id" className="block text-sm font-medium text-gray-700 mb-2">
                      Type de voyage
                    </label>
                    <select
                      id="travel_type_id"
                      name="travel_type_id"
                      value={formData.travel_type_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un type</option>
                      {travelTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="travel_theme_id" className="block text-sm font-medium text-gray-700 mb-2">
                      Thème de voyage
                    </label>
                    <select
                      id="travel_theme_id"
                      name="travel_theme_id"
                      value={formData.travel_theme_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un thème</option>
                      {travelThemes.map((theme) => (
                        <option key={theme.id} value={theme.id}>
                          {theme.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="number_of_travelers" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de voyageurs
                    </label>
                    <input
                      type="number"
                      id="number_of_travelers"
                      name="number_of_travelers"
                      value={formData.number_of_travelers}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="departure_date" className="block text-sm font-medium text-gray-700 mb-2">
                      Date de départ souhaitée
                    </label>
                    <input
                      type="date"
                      id="departure_date"
                      name="departure_date"
                      value={formData.departure_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="return_date" className="block text-sm font-medium text-gray-700 mb-2">
                      Date de retour souhaitée
                    </label>
                    <input
                      type="date"
                      id="return_date"
                      name="return_date"
                      value={formData.return_date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget approximatif
                    </label>
                    <select
                      id="budget_range"
                      name="budget_range"
                      value={formData.budget_range}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner une fourchette</option>
                      <option value="moins-2000">Moins de 2 000 CAD</option>
                      <option value="2000-5000">2 000 - 5 000 CAD</option>
                      <option value="5000-10000">5 000 - 10 000 CAD</option>
                      <option value="10000-20000">10 000 - 20 000 CAD</option>
                      <option value="plus-20000">Plus de 20 000 CAD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Demandes spéciales */}
              <div>
                <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-2">
                  Demandes spéciales ou commentaires
                </label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez vos attentes, préférences ou demandes particulières..."
                ></textarea>
              </div>

              {/* Message de retour */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  isSuccess 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Submit button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact info */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Vous préférez nous appeler ?</h2>
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
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Demander un devis</h1>
              <p className="text-lg text-gray-600">Chargement...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <DemanderDevisForm />
    </Suspense>
  );
}

