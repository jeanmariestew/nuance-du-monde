import { useState, useCallback } from 'react';
import { Destination, DestinationsByContinent } from '@/types';

interface UseDestinationsByContinentReturn {
  destinations: DestinationsByContinent | null;
  isLoading: boolean;
  error: string | null;
  fetchDestinations: () => Promise<void>;
  isDataLoaded: boolean;
}

export const useDestinationsByContinent = (): UseDestinationsByContinentReturn => {
  const [destinations, setDestinations] = useState<DestinationsByContinent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchDestinations = useCallback(async () => {
    // Si les données sont déjà chargées, ne pas refaire l'appel
    if (isDataLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/destinations/grouped-by-continent');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du chargement des destinations');
      }

      if (result.success && result.data) {
        setDestinations(result.data.grouped);
        setIsDataLoaded(true);
      } else {
        throw new Error(result.error || 'Aucune donnée reçue');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors du chargement des destinations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isDataLoaded, isLoading]);

  return {
    destinations,
    isLoading,
    error,
    fetchDestinations,
    isDataLoaded
  };
};
