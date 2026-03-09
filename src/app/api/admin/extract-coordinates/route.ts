import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// POST - Extraire les coordonnées depuis un itinéraire formaté (uniquement via IA)
export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Clé API Gemini non configurée' },
        { status: 500 }
      );
    }

    const { itinerary, destinations } = await request.json();

    if (!itinerary) {
      return NextResponse.json(
        { error: 'Itinéraire requis' },
        { status: 400 }
      );
    }

    // Construire le contexte géographique depuis les destinations
    let countryContext = '';
    if (destinations && Array.isArray(destinations) && destinations.length > 0) {
      const destinationNames = destinations
        .map((d: { name?: string; title?: string }) => d.name || d.title)
        .filter(Boolean)
        .join(', ');
      if (destinationNames) {
        countryContext = `
CONTEXTE GÉOGRAPHIQUE IMPORTANT:
Ce voyage se déroule dans les pays/régions suivants : ${destinationNames}.
Toutes les villes et lieux mentionnés dans l'itinéraire DOIVENT être localisés dans ces pays/régions.
Par exemple, si le voyage est en Égypte et que "Le Caire" est mentionné, utilise les coordonnées du Caire en Égypte (et non pas une autre ville du même nom ailleurs dans le monde).
`;
      }
    }

    // Prompt pour Gemini
    const prompt = `Tu es un assistant expert en géographie et voyages.
${countryContext}
ITINÉRAIRE:
${itinerary}

TÂCHE:
Pour CHAQUE jour de l'itinéraire:
1. Extrais le lieu principal (ville, site touristique, région)
2. Fournis les coordonnées GPS (latitude, longitude)

RÈGLES:
- Un jour = un lieu principal
- Si le voyageur reste au même endroit plusieurs jours, répète le lieu pour chaque jour
- Pour les coordonnées, utilise le centre-ville ou le point d'intérêt principal
- IMPORTANT: Les coordonnées doivent correspondre aux lieux dans le contexte géographique indiqué (pays/région du voyage)

RÉPONDS UNIQUEMENT en JSON valide, sans markdown, sans explication:
[
  {"day": 1, "location": "Nom du lieu", "lat": 48.8566, "lng": 2.3522},
  {"day": 2, "location": "Nom du lieu", "lat": 30.0444, "lng": 31.2357}
]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 4000 },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur Gemini:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Erreur API Gemini' },
        { status: response.status }
      );
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    
    // Nettoyer le JSON (enlever les backticks markdown si présents)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(text);
    
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json(
        { error: 'Impossible d\'extraire les coordonnées' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error: unknown) {
    console.error('Erreur extraction coordonnées:', error);
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
