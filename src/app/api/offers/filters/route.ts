import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentDestination = searchParams.get('destination');
    const currentType = searchParams.get('type');
    const currentTheme = searchParams.get('theme');

    const result = {
      destinations: [] as Array<{slug: string, title: string}>,
      types: [] as Array<{slug: string, title: string}>,
      themes: [] as Array<{slug: string, title: string}>
    };

    // Récupérer les destinations qui ont des offres
    if (!currentDestination) {
      let destinationQuery = `
        SELECT DISTINCT d.slug, d.title 
        FROM destinations d
        INNER JOIN offer_destinations od ON d.id = od.destination_id
        INNER JOIN offers o ON o.id = od.offer_id
        WHERE o.is_active = 1 AND d.is_active = 1
      `;
      const destinationParams: string[] = [];

      // Filtrer par type si spécifié
      if (currentType) {
        destinationQuery += `
          AND EXISTS (
            SELECT 1 FROM offer_travel_types ott 
            INNER JOIN travel_types tt ON tt.id = ott.travel_type_id 
            WHERE ott.offer_id = o.id AND tt.slug = ?
          )
        `;
        destinationParams.push(currentType);
      }

      // Filtrer par thème si spécifié
      if (currentTheme) {
        destinationQuery += `
          AND EXISTS (
            SELECT 1 FROM offer_travel_themes oth 
            INNER JOIN travel_themes th ON th.id = oth.travel_theme_id 
            WHERE oth.offer_id = o.id AND th.slug = ?
          )
        `;
        destinationParams.push(currentTheme);
      }

      destinationQuery += ' ORDER BY d.title ASC';
      const destinationRows = await query(destinationQuery, destinationParams);
      result.destinations = destinationRows as Array<{slug: string, title: string}>;
    }

    // Récupérer les types qui ont des offres
    if (!currentType) {
      let typeQuery = `
        SELECT DISTINCT tt.slug, tt.title 
        FROM travel_types tt
        INNER JOIN offer_travel_types ott ON tt.id = ott.travel_type_id
        INNER JOIN offers o ON o.id = ott.offer_id
        WHERE o.is_active = 1 AND tt.is_active = 1
      `;
      const typeParams: string[] = [];

      // Filtrer par destination si spécifiée
      if (currentDestination) {
        typeQuery += `
          AND EXISTS (
            SELECT 1 FROM offer_destinations od 
            INNER JOIN destinations d ON d.id = od.destination_id 
            WHERE od.offer_id = o.id AND d.slug = ?
          )
        `;
        typeParams.push(currentDestination);
      }

      // Filtrer par thème si spécifié
      if (currentTheme) {
        typeQuery += `
          AND EXISTS (
            SELECT 1 FROM offer_travel_themes oth 
            INNER JOIN travel_themes th ON th.id = oth.travel_theme_id 
            WHERE oth.offer_id = o.id AND th.slug = ?
          )
        `;
        typeParams.push(currentTheme);
      }

      typeQuery += ' ORDER BY tt.title ASC';
      const typeRows = await query(typeQuery, typeParams);
      result.types = typeRows as Array<{slug: string, title: string}>;
    }

    // Récupérer les thèmes qui ont des offres
    if (!currentTheme) {
      let themeQuery = `
        SELECT DISTINCT th.slug, th.title 
        FROM travel_themes th
        INNER JOIN offer_travel_themes oth ON th.id = oth.travel_theme_id
        INNER JOIN offers o ON o.id = oth.offer_id
        WHERE o.is_active = 1 AND th.is_active = 1
      `;
      const themeParams: string[] = [];

      // Filtrer par destination si spécifiée
      if (currentDestination) {
        themeQuery += `
          AND EXISTS (
            SELECT 1 FROM offer_destinations od 
            INNER JOIN destinations d ON d.id = od.destination_id 
            WHERE od.offer_id = o.id AND d.slug = ?
          )
        `;
        themeParams.push(currentDestination);
      }

      // Filtrer par type si spécifié
      if (currentType) {
        themeQuery += `
          AND EXISTS (
            SELECT 1 FROM offer_travel_types ott 
            INNER JOIN travel_types tt ON tt.id = ott.travel_type_id 
            WHERE ott.offer_id = o.id AND tt.slug = ?
          )
        `;
        themeParams.push(currentType);
      }

      themeQuery += ' ORDER BY th.title ASC';
      const themeRows = await query(themeQuery, themeParams);
      result.themes = themeRows as Array<{slug: string, title: string}>;
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Erreur lors de la récupération des filtres:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
