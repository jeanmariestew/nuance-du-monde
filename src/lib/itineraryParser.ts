interface DayItinerary {
  day: number;
  title: string;
  description: string;
  location?: string;
}

interface Location {
  name: string;
  lat: number;
  lng: number;
}

// Base de données simple de coordonnées pour les destinations populaires
const LOCATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Vietnam
  "hanoi": { lat: 21.0285, lng: 105.8542 },
  "hanoï": { lat: 21.0285, lng: 105.8542 },
  "ha long": { lat: 20.9101, lng: 107.1839 },
  "halong": { lat: 20.9101, lng: 107.1839 },
  "hue": { lat: 16.4637, lng: 107.5909 },
  "huế": { lat: 16.4637, lng: 107.5909 },
  "hoi an": { lat: 15.8801, lng: 108.3380 },
  "da nang": { lat: 16.0544, lng: 108.2022 },
  "danang": { lat: 16.0544, lng: 108.2022 },
  "ho chi minh": { lat: 10.8231, lng: 106.6297 },
  "saigon": { lat: 10.8231, lng: 106.6297 },
  "sapa": { lat: 22.3364, lng: 103.8438 },
  "ninh binh": { lat: 20.2506, lng: 105.9745 },
  "phnom penh": { lat: 11.5564, lng: 104.9282 },
  "siem reap": { lat: 13.3671, lng: 103.8448 },
  "lao cai": { lat: 22.4856, lng: 103.9707 },
  
  // France
  "paris": { lat: 48.8566, lng: 2.3522 },
  "lyon": { lat: 45.7640, lng: 4.8357 },
  "marseille": { lat: 43.2965, lng: 5.3698 },
  "nice": { lat: 43.7102, lng: 7.2620 },
  "bordeaux": { lat: 44.8378, lng: -0.5792 },
  
  // Autres destinations populaires
  "tokyo": { lat: 35.6762, lng: 139.6503 },
  "bangkok": { lat: 13.7563, lng: 100.5018 },
  "new york": { lat: 40.7128, lng: -74.0060 },
  "london": { lat: 51.5074, lng: -0.1278 },
  "londres": { lat: 51.5074, lng: -0.1278 },
  "rome": { lat: 41.9028, lng: 12.4964 },
  "barcelona": { lat: 41.3851, lng: 2.1734 },
  "barcelone": { lat: 41.3851, lng: 2.1734 },
  "dubai": { lat: 25.2048, lng: 55.2708 },
  "sydney": { lat: -33.8688, lng: 151.2093 },
};

/**
 * Parse la description d'une offre pour extraire l'itinéraire jour par jour
 */
export function parseItinerary(description: string): DayItinerary[] {
  if (!description) return [];

  const lines = description.split("\n");
  const itinerary: DayItinerary[] = [];
  let currentDay: DayItinerary | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Détecte les lignes de type "Jour 1", "JOUR 14", etc.
    const dayMatch = trimmedLine.match(/^Jour\s+(\d+)\s*:?\s*(.*)$/i);
    
    if (dayMatch) {
      // Si on avait un jour en cours, on le sauvegarde
      if (currentDay) {
        itinerary.push(currentDay);
      }
      
      // Commence un nouveau jour
      const dayNumber = parseInt(dayMatch[1]);
      const title = dayMatch[2].trim() || `Jour ${dayNumber}`;
      
      currentDay = {
        day: dayNumber,
        title: title,
        description: "",
        location: extractLocation(title),
      };
    } else if (currentDay && trimmedLine) {
      // Ajoute la ligne à la description du jour courant
      if (currentDay.description) {
        currentDay.description += " ";
      }
      currentDay.description += trimmedLine;
      
      // Essaie d'extraire une localisation si pas encore trouvée
      if (!currentDay.location) {
        currentDay.location = extractLocation(trimmedLine);
      }
    }
  }

  // N'oublie pas le dernier jour
  if (currentDay) {
    itinerary.push(currentDay);
  }

  return itinerary;
}

/**
 * Extrait les localisations uniques de l'itinéraire avec leurs coordonnées
 */
export async function extractLocations(itinerary: DayItinerary[]): Promise<Location[]> {
  const locationSet = new Set<string>();
  const locations: Location[] = [];

  for (const day of itinerary) {
    if (day.location) {
      const normalizedLocation = day.location.toLowerCase();
      
      if (!locationSet.has(normalizedLocation)) {
        locationSet.add(normalizedLocation);
        
        // Cherche les coordonnées
        const coords = await findCoordinates(normalizedLocation);
        if (coords) {
          locations.push({
            name: day.location,
            ...coords,
          });
        }
      }
    }
  }

  return locations;
}

/**
 * Extrait le nom d'une localisation depuis une chaîne de texte
 */
function extractLocation(text: string): string | undefined {
  // Cherche des patterns communs
  const patterns = [
    /(?:à|vers|de|en)\s+([A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+)?)/,
    /([A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+)?)\s*-/,
    /^([A-ZÀ-Ü][a-zà-ü]+(?:\s+[A-ZÀ-Ü][a-zà-ü]+)?)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const location = match[1].trim();
      return location;
    }
  }

  return undefined;
}

/**
 * Trouve les coordonnées d'une localisation
 * Utilise d'abord le cache local, puis l'API Nominatim si nécessaire
 */
async function findCoordinates(locationName: string): Promise<{ lat: number; lng: number } | null> {
  const normalized = locationName.toLowerCase().trim();
  
  // Recherche exacte dans le cache
  if (LOCATION_COORDINATES[normalized]) {
    return LOCATION_COORDINATES[normalized];
  }

  // Recherche partielle dans le cache
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  // Si pas trouvé dans le cache, utiliser l'API Nominatim
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'NuanceDuMonde/1.0',
        },
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      
      // Mettre en cache pour les prochaines fois
      LOCATION_COORDINATES[normalized] = coords;
      
      return coords;
    }
  } catch (error) {
    console.error(`Erreur lors de la géolocalisation de "${locationName}":`, error);
  }

  return null;
}

/**
 * Extrait les localisations depuis les destinations de l'offre
 */
export async function getDestinationLocations(
  destinations?: Array<{ title: string; slug: string }>
): Promise<Location[]> {
  if (!destinations || destinations.length === 0) return [];

  const locations: Location[] = [];

  for (const dest of destinations) {
    const coords = await findCoordinates(dest.title.toLowerCase());
    if (coords) {
      locations.push({
        name: dest.title,
        ...coords,
      });
    }
  }

  return locations;
}
