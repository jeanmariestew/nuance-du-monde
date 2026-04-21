"use client";

import { useState } from 'react';
import { useProfessional } from '@/contexts/ProfessionalContext';

interface ProfessionalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'login' | 'register';

export default function ProfessionalAuthModal({ isOpen, onClose }: ProfessionalAuthModalProps) {
  const { login } = useProfessional();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setAgencyName('');
    setFirstName('');
    setLastName('');
    setCertificateNumber('');
    setPhone('');
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !certificateNumber) {
      setError('Email et numéro de permis requis');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/professionals/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, certificate_number: certificateNumber }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        login(data.data.email, data.data.agencyName, data.data.certificateNumber);
        resetForm();
        onClose();
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !agencyName || !certificateNumber) {
      setError('Tous les champs obligatoires doivent être remplis');
      return;
    }

    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/professionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          agency_name: agencyName,
          first_name: firstName,
          last_name: lastName,
          certificate_number: certificateNumber,
          phone: phone || null
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        if (data.status === 'validated') {
          login(email, agencyName, certificateNumber);
          resetForm();
          onClose();
        } else {
          setSuccess(data.message || 'Demande enregistrée. Vous serez notifié une fois validé.');
          setTimeout(() => {
            resetForm();
            setMode('login');
          }, 3000);
        }
      } else {
        setError(data.error || 'Erreur lors de l\'inscription');
      }
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-yellow-500 to-yellow-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Espace Professionnel</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/90 text-sm mt-1">
            Connectez-vous avec vos identifiants professionnels
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            type="button"
            onClick={() => { setMode('login'); resetForm(); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mode === 'login' 
                ? 'text-yellow-600 border-b-2 border-yellow-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); resetForm(); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mode === 'register' 
                ? 'text-yellow-600 border-b-2 border-yellow-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            S&apos;inscrire
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email professionnelle *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white text-gray-900"
              placeholder="contact@votre-agence.com"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;agence *
                </label>
                <input
                  type="text"
                  id="agencyName"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white text-gray-900"
                  placeholder="Nom de votre agence de voyage"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom du conseiller *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white text-gray-900"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du conseiller *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white text-gray-900"
                    placeholder="Nom"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de permis *
            </label>
            <input
              type="text"
              id="certificateNumber"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white text-gray-900"
              placeholder="Ex: 702345"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white text-gray-900"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {mode === 'login' ? 'Connexion...' : 'Inscription...'}
              </span>
            ) : (
              mode === 'login' ? "Se connecter" : "Demander l'accès"
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            {mode === 'login' 
              ? "Connectez-vous avec votre email et numéro de permis."
              : "Votre demande sera validée par notre équipe sous 24-48h."
            }
          </p>
        </form>
      </div>
    </div>
  );
}
