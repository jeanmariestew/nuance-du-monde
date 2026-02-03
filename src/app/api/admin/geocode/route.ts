import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// API pour la géolocalisation intelligente avec sélection IA
// Résout le problème des villes avec le même nom dans différents pays

interface GeocodingResult {
  name: string;
  lat: number;
  lng: number;
  country?: string;
  display_name?: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    country?: string;
    state?: string;
    city?: string;
  };
}

// POST - Géolocaliser une liste de lieux avec contexte
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locations, context } = body;
    
    // locations: array of location names to geocode
    // context: { country?: string, region?: string, itinerary?: string }
    
    if (!locations || !Array.isArray(locations) || locations.length === 0) {
      return NextResponse.json(
        { error: 'locations doit être un tableau non vide' },
        { status: 400 }
      );
    }

    const results: GeocodingResult[] = [];

    for (const locationName of locations) {
      // 1. Chercher plusieurs résultats via Nominatim
      const nominatimResults = await searchNominatim(locationName);
      
      if (nominatimResults.length === 0) {
        console.log(`Aucun résultat pour: ${locationName}`);
        continue;
      }

      // 2. Si un seul résultat, l'utiliser directement
      if (nominatimResults.length === 1) {
        results.push({
          name: locationName,
          lat: parseFloat(nominatimResults[0].lat),
          lng: parseFloat(nominatimResults[0].lon),
          display_name: nominatimResults[0].display_name,
        });
        continue;
      }

      // 3. Si plusieurs résultats, utiliser l'IA pour choisir le bon
      const selectedResult = await selectWithAI(locationName, nominatimResults, context);
      
      if (selectedResult) {
        results.push({
          name: locationName,
          lat: parseFloat(selectedResult.lat),
          lng: parseFloat(selectedResult.lon),
          display_name: selectedResult.display_name,
        });
      }
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    console.error('Erreur géolocalisation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Recherche via Nominatim avec plusieurs résultats
async function searchNominatim(locationName: string): Promise<NominatimResult[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'NuanceDuMonde/1.0',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur Nominatim pour "${locationName}":`, error);
    return [];
  }
}

// Utilise l'IA pour sélectionner le bon résultat parmi plusieurs
async function selectWithAI(
  locationName: string,
  candidates: NominatimResult[],
  context?: { country?: string; region?: string; itinerary?: string }
): Promise<NominatimResult | null> {
  if (!GEMINI_API_KEY) {
    console.log('Pas de clé Gemini, utilisation du premier résultat');
    return candidates[0];
  }

  try {
    const options = candidates.map((c, i) => ({
      index: i,
      display_name: c.display_name,
    }));

    const prompt = `Tu es un assistant de géolocalisation pour une agence de voyage.

Je cherche les coordonnées de "${locationName}" pour un voyage.

${context?.country ? `Contexte: Le voyage se déroule principalement en/au ${context.country}.` : ''}
${context?.region ? `Région: ${context.region}` : ''}
${context?.itinerary ? `Extrait de l'itinéraire: ${context.itinerary.substring(0, 500)}` : ''}

Voici les résultats de recherche possibles:
${options.map(o => `${o.index}. ${o.display_name}`).join('\n')}

Réponds UNIQUEMENT avec le numéro (0, 1, 2, etc.) du résultat le plus pertinent pour ce voyage.
Si tu n'es pas sûr, choisis le résultat qui semble le plus touristique ou le plus connu.
Réponds avec un seul chiffre, rien d'autre.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 10 },
        }),
      }
    );

    if (!response.ok) {
      console.error('Erreur Gemini:', await response.text());
      return candidates[0];
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    
    const match = text.match(/\d+/);
    if (match) {
      const index = parseInt(match[0]);
      if (index >= 0 && index < candidates.length) {
        console.log(`IA a sélectionné pour "${locationName}": ${candidates[index].display_name}`);
        return candidates[index];
      }
    }
    
    return candidates[0];
  } catch (error) {
    console.error('Erreur IA sélection:', error);
    return candidates[0];
  }
}

// GET - Géolocaliser un seul lieu (pour tests)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const country = searchParams.get('country');
  
  if (!location) {
    return NextResponse.json({ error: 'location requis' }, { status: 400 });
  }

  try {
    const nominatimResults = await searchNominatim(location);
    
    if (nominatimResults.length === 0) {
      return NextResponse.json({ error: 'Aucun résultat' }, { status: 404 });
    }

    if (nominatimResults.length === 1 || !process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: true,
        data: {
          name: location,
          lat: parseFloat(nominatimResults[0].lat),
          lng: parseFloat(nominatimResults[0].lon),
          display_name: nominatimResults[0].display_name,
        },
        candidates: nominatimResults.length,
      });
    }

    const selectedResult = await selectWithAI(location, nominatimResults, { country: country || undefined });
    
    if (selectedResult) {
      return NextResponse.json({
        success: true,
        data: {
          name: location,
          lat: parseFloat(selectedResult.lat),
          lng: parseFloat(selectedResult.lon),
          display_name: selectedResult.display_name,
        },
        candidates: nominatimResults.length,
        selected_by: 'ai',
      });
    }

    return NextResponse.json({ error: 'Impossible de sélectionner' }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
