"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProfessionalSession {
  email: string;
  agencyName: string;
  certificateNumber: string;
  isAuthenticated: boolean;
}

interface ProfessionalContextType {
  session: ProfessionalSession | null;
  login: (email: string, agencyName: string, certificateNumber: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const ProfessionalContext = createContext<ProfessionalContextType | undefined>(undefined);

const STORAGE_KEY = 'nuance_professional_session';

export function ProfessionalProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ProfessionalSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la session depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSession(parsed);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la session professionnelle:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string, agencyName: string, certificateNumber: string) => {
    const newSession: ProfessionalSession = {
      email,
      agencyName,
      certificateNumber,
      isAuthenticated: true,
    };
    setSession(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
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
