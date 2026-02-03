import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Clé API Gemini non configurée. Ajoutez GEMINI_API_KEY dans le fichier .env' },
        { status: 500 }
      );
    }

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Texte requis' },
        { status: 400 }
      );
    }

    const prompt = `Tu es un assistant qui formate des itinéraires de voyage.

RÈGLES IMPORTANTES :
1. S'il y a du texte AVANT "Jour 1" (introduction, expériences incluses, points forts, etc.), CONSERVE-LE MOT POUR MOT au début, précédé de "Introduction :" sur une ligne séparée
2. GARDE LE MAXIMUM D'INFORMATIONS du texte original - ne résume pas, ne supprime rien d'important
3. Structure chaque jour avec les sections suivantes (chacune sur une ligne séparée) :
   - Jour X : [Nom de la destination principale]
   - Activités : [TOUTES les activités, visites, expériences mentionnées - garde tous les détails]
   - Transports : [Moyens de transport SI mentionnés - sinon OMETS cette ligne complètement]
   - Hébergements : [Type d'hébergement SI mentionné - sinon OMETS cette ligne complètement]

4. Si une information n'est pas mentionnée (transport ou hébergement), N'INVENTE PAS et n'écris pas la ligne
5. Sépare les jours par une ligne vide
6. Retourne UNIQUEMENT le texte formaté, sans explication ni commentaire
7. Conserve les noms propres, les détails spécifiques, les durées, etc.

EXEMPLE DE FORMAT ATTENDU :
Introduction :
Nos expériences "Plus"
Les vols internationaux inclus
Découverte du mythique glacier Perito Moreno
Les trésors classés à l'UNESCO : chute de guazu - le Parc national Los Glacaires
Expérience sensorielle à Buenos Aires : dîner-spectacle de tango
Visites des confins sauvages de la Patagonie
Hébergements en première catégorie supérieur

Jour 1 : Montreal > Buenos Aires
Activités : Rendez-vous à l'aéroport, assistance aux formalités et envol à destination de Buenos Aires. Vol avec 1 bagage en soute. Service et nuit à bord.

Jour 2 : Buenos Aires
Activités : Arrivée à Buenos Aires, transfert vers l'hôtel, visite du quartier de La Boca
Hébergements : Hôtel 4 étoiles

Voici l'itinéraire à formater :

${text}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            // maxOutputTokens: 50000,
          },
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
    const formattedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ formattedText });
  } catch (error: any) {
    console.error('Erreur formatage itinéraire:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
