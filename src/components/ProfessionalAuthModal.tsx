"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfessional } from '@/contexts/ProfessionalContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface ProfessionalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectAfterAuth?: string;
  initialStep?: 'email' | 'register';
}

type Step = 'email' | 'login' | 'pending' | 'setup_link_sent' | 'register' | 'registered';
type EmailStatus = 'not_found' | 'pending' | 'validated_no_password' | 'validated_has_password' | 'rejected';

export default function ProfessionalAuthModal({ isOpen, onClose, redirectAfterAuth, initialStep }: ProfessionalAuthModalProps) {
  const { login } = useProfessional();
  const router = useRouter();

  // États partagés
  const [step, setStep] = useState<Step>(initialStep ?? 'email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // États pour login
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // États pour register
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [phone, setPhone] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep ?? 'email');
      setError('');
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setAgencyName('');
    setPhone('');
    setCertificateNumber('');
    setError('');
    setStep('email');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // ÉTAPE 1: Vérifier l'email
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email requis');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/professionals/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Erreur lors de la vérification');
        return;
      }

      const status: EmailStatus = data.status;

      if (status === 'not_found') {
        setStep('register');
      } else if (status === 'pending') {
        setStep('pending');
      } else if (status === 'validated_no_password') {
        setStep('setup_link_sent');
      } else if (status === 'validated_has_password') {
        setStep('login');
      } else if (status === 'rejected') {
        setError('Votre demande d\'accès a été refusée. Contactez-nous pour plus d\'informations.');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // ÉTAPE 2: Login avec mot de passe
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Mot de passe requis');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/professionals/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Erreur de connexion');
        return;
      }

      // Mettre à jour le contexte
      login({
        id: data.data.id,
        email: data.data.email,
        agencyName: data.data.agencyName,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        certificateNumber: data.data.certificateNumber,
        opcVerified: data.data.opcVerified || false,
      });

      resetForm();
      handleClose();

      if (redirectAfterAuth) {
        router.push(redirectAfterAuth);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Envoyer lien de configuration
  const handleSendSetupLink = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/professionals/send-setup-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Erreur lors de l\'envoi');
        return;
      }

      setStep('setup_link_sent');
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // ÉTAPE 3: Inscription
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !certificateNumber) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/professionals/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          agency_name: agencyName?.trim() || null,
          phone: phone?.trim() || null,
          certificate_number: certificateNumber.trim(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Erreur lors de l\'inscription');
        return;
      }

      setStep('registered');
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Mot de passe oublié
  const handleForgotPassword = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/professionals/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Erreur lors de l\'envoi');
        return;
      }

      setError('');
      alert('Un lien de réinitialisation a été envoyé à votre email');
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-black px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#FFFF00] font-[Alro] uppercase tracking-wide">
                Espace Agents de voyage
              </h2>
              <p className="text-white/70 text-sm mt-1">
                {step === 'email' && 'Entrez votre email'}
                {step === 'login' && 'Connexion'}
                {step === 'pending' && 'Compte en attente'}
                {step === 'setup_link_sent' && 'Lien envoyé'}
                {step === 'register' && 'Créer un compte'}
                {step === 'registered' && 'Inscription réussie'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white/60 hover:text-white transition-colors ml-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="h-1 bg-[#FFFF00]" />

        {/* Contenu */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* STEP: Email */}
          {step === 'email' && (
            <form onSubmit={handleCheckEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-[#FFFF00] font-bold py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Continuer
              </button>
            </form>
          )}

          {/* STEP: Login */}
          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                <p>Email: <strong>{email}</strong></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-[#FFFF00] font-bold py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Se connecter
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full text-center text-sm text-gray-600 hover:text-black"
              >
                Mot de passe oublié?
              </button>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-sm text-gray-600 hover:text-black"
              >
                ← Retour
              </button>
            </form>
          )}

          {/* STEP: Pending */}
          {step === 'pending' && (
            <div className="text-center space-y-4">
              <div className="text-4xl">⏳</div>
              <h3 className="text-lg font-bold text-gray-900">Compte en attente</h3>
              <p className="text-gray-600 text-sm">
                Votre demande d'accès est actuellement en cours de vérification.
              </p>
              <p className="text-gray-600 text-sm">
                Vous recevrez un email de confirmation dès que votre accès sera validé.
              </p>
              <button
                onClick={() => setStep('email')}
                className="w-full text-center text-sm text-gray-600 hover:text-black"
              >
                ← Retour
              </button>
            </div>
          )}

          {/* STEP: Setup Link Sent */}
          {step === 'setup_link_sent' && (
            <div className="text-center space-y-4">
              <div className="text-4xl">📧</div>
              <h3 className="text-lg font-bold text-gray-900">Lien envoyé</h3>
              <p className="text-gray-600 text-sm">
                Un lien de configuration a été envoyé à <strong>{email}</strong>
              </p>
              <p className="text-gray-600 text-sm">
                Cliquez sur le lien dans l'email pour configurer votre mot de passe.
              </p>
              <button
                onClick={handleSendSetupLink}
                disabled={loading}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 rounded-lg text-sm disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Renvoyer le lien'}
              </button>
              <button
                onClick={() => setStep('email')}
                className="w-full text-center text-sm text-gray-600 hover:text-black"
              >
                ← Retour
              </button>
            </div>
          )}

          {/* STEP: Register */}
          {step === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nom"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agence
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Nom de l'agence"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Numéro de téléphone"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de permis OPC *
                </label>
                <input
                  type="text"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  placeholder="Ex: 702345"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-[#FFFF00] font-bold py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                Créer mon compte
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-sm text-gray-600 hover:text-black"
              >
                ← Retour
              </button>
            </form>
          )}

          {/* STEP: Registered */}
          {step === 'registered' && (
            <div className="text-center space-y-4">
              <div className="text-4xl">✅</div>
              <h3 className="text-lg font-bold text-gray-900">Inscription réussie!</h3>
              <p className="text-gray-600 text-sm">
                Votre compte a été créé avec succès.
              </p>
              <p className="text-gray-600 text-sm">
                Vous allez recevoir un email de confirmation. Veuillez cliquer sur le lien pour valider votre accès.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-black hover:bg-gray-900 text-[#FFFF00] font-bold py-3 rounded-lg"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
