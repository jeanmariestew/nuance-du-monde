"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProfessionalSession {
  id: number;
  email: string;
  agencyName: string;
  firstName: string;
  lastName: string;
  certificateNumber: string;
  opcVerified: boolean;
  isAuthenticated: boolean;
}

interface ProfessionalContextType {
  session: ProfessionalSession | null;
  login: (data: Omit<ProfessionalSession, 'isAuthenticated'>) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const ProfessionalContext = createContext<ProfessionalContextType | undefined>(undefined);

export function ProfessionalProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ProfessionalSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au montage, vérifier la session via le cookie côté serveur
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/professionals/me');

        if (res.ok) {
          const data = await res.json();

          if (data.success && data.data) {
            setSession({
              ...data.data,
              isAuthenticated: true,
            });
          }
        } else {
          // Pas de session valide
          setSession(null);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (data: Omit<ProfessionalSession, 'isAuthenticated'>) => {
    const newSession: ProfessionalSession = {
      ...data,
      isAuthenticated: true,
    };
    setSession(newSession);
  };

  const logout = async () => {
    try {
      await fetch('/api/professionals/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erreur lors du logout:', error);
    } finally {
      setSession(null);
    }
  };

  return (
    <ProfessionalContext.Provider value={{ session, login, logout, isLoading }}>
      {children}
    </ProfessionalContext.Provider>
  );
}

export function useProfessional() {
  const context = useContext(ProfessionalContext);
  if (context === undefined) {
    throw new Error('useProfessional must be used within a ProfessionalProvider');
  }
  return context;
}
