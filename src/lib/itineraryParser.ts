interface DayItinerary {
  day: number;
  // Tous les jours couverts par cette étape (ex. [10, 11, 12] pour "Jour 10-12")
  dayNumbers: number[];
  title: string;
  description: string;
  location?: string;
  activities?: string;
  meals?: string;
  transports?: string;
  accommodation?: string;
}

export interface ItineraryResult {
  introduction?: string;
  days: DayItinerary[];
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
 * Reconnaît un en-tête de jour et retourne tous les jours qu'il couvre.
 * Formats acceptés : "Jour 3", "Jour 10-11-12", "Jours 10 à 12", "Jours 10, 11 et 12".
 * Retourne null si la ligne n'est pas un en-tête de jour.
 */
export function parseDayHeader(line: string): { days: number[]; title: string } | null {
  const multi = line.match(/^Jours?\s*(\d+(?:\s*(?:[-–—,&]|à|au|et)\s*\d+)*)\s*[:\-–—]?\s*(.*)$/i);
  if (!multi) return null;

  const days: number[] = [];
  let isRange = false;
  let valid = true;

  for (const token of multi[1].match(/\d+|au|à|et|[-–—,&]/gi) ?? []) {
    if (/^\d+$/.test(token)) {
      const n = parseInt(token, 10);
      const last = days[days.length - 1];
      if (last !== undefined && n <= last) { valid = false; break; }
      if (isRange && last !== undefined) {
        if (n - last > 60) { valid = false; break; }
        for (let d = last + 1; d <= n; d++) days.push(d);
      } else {
        days.push(n);
      }
      isRange = false;
    } else {
      isRange = /^(?:[-–—]|à|au)$/i.test(token);
    }
  }

  // "Jour 1 - 2 nuits à Paris" : le 2 est une durée, pas un jour
  if (valid && days.length > 0 && !/^(?:nuits?|jours?)\b/i.test(multi[2].trim())) {
    return { days, title: multi[2].trim() };
  }

  // Séquence incohérente (ex. "Jour 1 - 2 nuits à Paris") : on ne garde que le premier numéro
  const single = line.match(/^Jours?\s*(\d+)\s*[:\-–—]?\s*(.*)$/i);
  return single ? { days: [parseInt(single[1], 10)], title: single[2].trim() } : null;
}

/**
 * Libellé compact d'une liste de jours : [3] -> "3", [10, 11, 12] -> "10-12", [1, 3] -> "1, 3"
 */
export function formatDayLabel(days: number[]): string {
  if (days.length <= 1) return String(days[0] ?? "");
  const contiguous = days.every((d, i) => i === 0 || d === days[i - 1] + 1);
  return contiguous ? `${days[0]}-${days[days.length - 1]}` : days.join(", ");
}

/**
 * Parse la description d'une offre pour extraire l'itinéraire jour par jour
 */
export function parseItinerary(description: string): DayItinerary[] {
  return parseItineraryWithIntro(description).days;
}

/**
 * Parse la description d'une offre pour extraire l'introduction et l'itinéraire
 */
export function parseItineraryWithIntro(description: string): ItineraryResult {
  if (!description) return { days: [] };

  const lines = description.split("\n");
  const itinerary: DayItinerary[] = [];
  let currentDay: DayItinerary | null = null;
  let currentSection: 'introduction' | 'description' | 'activities' | 'meals' | 'transports' | 'accommodation' = 'introduction';
  const introduction: string[] = [];
  let inIntroduction = true;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Détecte "Introduction :" au début
    const introMatch = trimmedLine.match(/^Introduction\s*:\s*(.*)$/i);
    if (introMatch) {
      if (introMatch[1]) {
        introduction.push(introMatch[1]);
      }
      continue;
    }
    
    // Détecte les lignes de type "Jour 1", "JOUR 14", "Jour 10-11-12", "Jours 10 à 12", etc.
    const dayMatch = parseDayHeader(trimmedLine);

    if (dayMatch) {
      inIntroduction = false;
      // Si on avait un jour en cours, on le sauvegarde
      if (currentDay) {
        itinerary.push(currentDay);
      }

      // Commence un nouveau jour (ou une étape couvrant plusieurs jours)
      const dayNumber = dayMatch.days[0];
      const title = dayMatch.title || `Jour ${formatDayLabel(dayMatch.days)}`;

      currentDay = {
        day: dayNumber,
        dayNumbers: dayMatch.days,
        title: title,
        description: "",
        location: extractLocation(title),
        activities: undefined,
        meals: undefined,
        transports: undefined,
        accommodation: undefined,
      };
      currentSection = 'description';
    } else if (inIntroduction && trimmedLine) {
      // On est encore dans l'introduction
      introduction.push(trimmedLine);
    } else if (currentDay && trimmedLine) {
      // Détecte les sections spécifiques
      const activitiesMatch = trimmedLine.match(/^Activit[ée]s?\s*:\s*(.*)$/i);
      const mealsMatch = trimmedLine.match(/^Repas\s*:\s*(.*)$/i);
      const transportsMatch = trimmedLine.match(/^Transports?\s*:\s*(.*)$/i);
      const accommodationMatch = trimmedLine.match(/^H[ée]bergements?\s*:\s*(.*)$/i);
      
      if (activitiesMatch) {
        currentSection = 'activities';
        if (activitiesMatch[1]) {
          currentDay.activities = activitiesMatch[1].trim();
        }
      } else if (mealsMatch) {
        currentSection = 'meals';
        if (mealsMatch[1]) {
          currentDay.meals = mealsMatch[1].trim();
        }
      } else if (transportsMatch) {
        currentSection = 'transports';
        if (transportsMatch[1]) {
          currentDay.transports = transportsMatch[1].trim();
        }
      } else if (accommodationMatch) {
        currentSection = 'accommodation';
        if (accommodationMatch[1]) {
          currentDay.accommodation = accommodationMatch[1].trim();
        }
      } else {
        // Ajoute la ligne à la section courante
        if (currentSection === 'activities') {
          currentDay.activities = currentDay.activities 
            ? currentDay.activities + ' ' + trimmedLine 
            : trimmedLine;
        } else if (currentSection === 'meals') {
          currentDay.meals = currentDay.meals 
            ? currentDay.meals + ' ' + trimmedLine 
            : trimmedLine;
        } else if (currentSection === 'transports') {
          currentDay.transports = currentDay.transports 
            ? currentDay.transports + ' ' + trimmedLine 
            : trimmedLine;
        } else if (currentSection === 'accommodation') {
          currentDay.accommodation = currentDay.accommodation 
            ? currentDay.accommodation + ' ' + trimmedLine 
            : trimmedLine;
        } else {
          // Description générale
          if (currentDay.description) {
            currentDay.description += " ";
          }
          currentDay.description += trimmedLine;
        }
      }
      
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

  return {
    introduction: introduction.length > 0 ? introduction.join('\n') : undefined,
    days: itinerary,
  };
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
 * Utilise d'abord le cache local, puis l'API de géolocalisation intelligente
 */
async function findCoordinates(locationName: string, context?: { country?: string; itinerary?: string }): Promise<{ lat: number; lng: number } | null> {
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

  // Si pas trouvé dans le cache, utiliser l'API de géolocalisation intelligente
  try {
    // Essayer d'abord l'API admin avec sélection IA
    const apiResponse = await fetch('/api/admin/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locations: [locationName],
        context: context || {},
      }),
    });
    
    if (apiResponse.ok) {
      const result = await apiResponse.json();
      if (result.data && result.data.length > 0) {
        const coords = {
          lat: result.data[0].lat,
          lng: result.data[0].lng,
        };
        LOCATION_COORDINATES[normalized] = coords;
        return coords;
      }
    }
    
    // Fallback: API Nominatim directe
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
