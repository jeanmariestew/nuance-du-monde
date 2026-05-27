'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface VerifyResponse {
  success: boolean;
  error?: string;
  data?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface SetPasswordResponse {
  success: boolean;
  error?: string;
  message?: string;
  redirect?: string;
}

export default function ConfigurerMotDePassePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const isReset = searchParams.get('reset') === 'true';

  const [step, setStep] = useState<'loading' | 'form' | 'error' | 'success'>('loading');
  const [professional, setProfessional] = useState<{ email: string; firstName: string; lastName: string } | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérifier le token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token manquant');
        setStep('error');
        return;
      }

      try {
        const res = await fetch(`/api/professionals/verify-token?token=${token}`);
        const data: VerifyResponse = await res.json();

        if (!data.success || !data.data) {
          setError(data.error || 'Token invalide ou expiré');
          setStep('error');
          return;
        }

        setProfessional(data.data);
        setStep('form');
      } catch (err) {
        console.error('Erreur vérification token:', err);
        setError('Erreur lors de la vérification du token');
        setStep('error');
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client
    if (!password || !passwordConfirm) {
      setError('Tous les champs sont requis');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/professionals/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, passwordConfirm }),
      });

      const data: SetPasswordResponse = await res.json();

      if (!data.success) {
        setError(data.error || 'Erreur lors de la configuration du mot de passe');
        return;
      }

      setStep('success');
      // Redirection immédiate vers espace-pro (session établie via cookie)
      setTimeout(() => {
        router.push('/espace-pro');
      }, 1500);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la configuration du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Loading */}
        {step === 'loading' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Vérification du lien...</p>
          </div>
        )}

        {/* Form */}
        {step === 'form' && professional && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-black text-white px-8 py-6 text-center">
              <h1 className="text-2xl font-bold">
                {isReset ? 'Réinitialiser votre mot de passe' : 'Configurer votre mot de passe'}
              </h1>
              <p className="mt-2 text-yellow-400 text-sm">Nuance du Monde</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="mb-4">
                <p className="text-gray-700 text-sm">
                  Email: <strong>{professional.email}</strong>
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Mot de passe */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-10"
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

              {/* Confirmer mot de passe */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-yellow-400 font-bold py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'En cours...' : isReset ? 'Réinitialiser' : 'Configurer'}
              </button>
            </form>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/espace-pro')}
              className="inline-block bg-black text-yellow-400 font-bold px-6 py-3 rounded-lg hover:bg-gray-900"
            >
              Retourner à l'accueil
            </button>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Succès!</h1>
            <p className="text-gray-600 mb-6">Votre mot de passe a été configuré avec succès.</p>
            <p className="text-sm text-gray-500">Redirection en cours...</p>
          </div>
        )}
      </div>
    </div>
  );
}
