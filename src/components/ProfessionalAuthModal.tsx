"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfessional } from '@/contexts/ProfessionalContext';

interface ProfessionalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectAfterAuth?: string;
}

export default function ProfessionalAuthModal({ isOpen, onClose, redirectAfterAuth }: ProfessionalAuthModalProps) {
  const { login } = useProfessional();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setCertificateNumber('');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !certificateNumber) {
      setError('Tous les champs sont requis');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/professionals/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          certificate_number: certificateNumber,
        }),
      });

      const data = await res.json();

      if (data.success) {
        login(
          data.data.email,
          data.data.agencyName,
          data.data.firstName,
          data.data.lastName,
          data.data.certificateNumber
        );
        resetForm();
        onClose();
        if (redirectAfterAuth) {
          router.push(redirectAfterAuth);
        }
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header jaune */}
        <div className="bg-black px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#FFFF00] font-[Alro] uppercase tracking-wide">
                Espace Agents de voyage
              </h2>
              <p className="text-white/70 text-sm mt-1">
                Connectez-vous avec vos identifiants professionnels
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors ml-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Barre jaune */}
        <div className="h-1 bg-[#FFFF00]" />

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors bg-white text-gray-900"
                placeholder="Prénom"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors bg-white text-gray-900"
                placeholder="Nom"
                autoComplete="family-name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de permis OPC *
            </label>
            <input
              type="text"
              id="certificateNumber"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors bg-white text-gray-900"
              placeholder="Ex: 702345"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-gray-900 text-[#FFFF00] font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Connexion...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
              Pas encore inscrit ?{' '}
              <a
                href="/inscription-agents"
                className="font-semibold text-black hover:underline"
                onClick={onClose}
              >
                Créer mon accès
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
