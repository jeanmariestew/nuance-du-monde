import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Destination, ApiResponse, DestinationsByContinent } from '@/types';

export async function GET() {
  try {
    // Récupère les destinations actives qui ont au moins une offre active
    const squery = `
      SELECT DISTINCT
        d.id,
        d.title,
        d.slug,
        d.continent,
        d.short_description,
        d.banner_image_url,
        d.price_from,
        d.price_currency,
        d.duration_days,
        d.duration_nights,
        d.sort_order
      FROM destinations d
      INNER JOIN offer_destinations od ON od.destination_id = d.id
      INNER JOIN offers o ON o.id = od.offer_id AND o.is_active = 1
      WHERE d.is_active = 1 
        AND d.continent IS NOT NULL 
        AND d.continent != ''
      ORDER BY d.continent ASC, d.sort_order ASC, d.title ASC
    `;

    const rows = await query(squery);
    const destinations = rows as Destination[];
    
    // Regrouper les destinations par continent
    const groupedDestinations: DestinationsByContinent = {};
    
    destinations.forEach((destination) => {
      const continent = destination.continent!;
      if (!groupedDestinations[continent]) {
        groupedDestinations[continent] = [];
      }
      groupedDestinations[continent].push(destination);
    });

    // Calculer les statistiques
    const continentStats = Object.keys(groupedDestinations).map(continent => ({
      continent,
      count: groupedDestinations[continent].length,
      destinations: groupedDestinations[continent]
    }));

    const response: ApiResponse<{
      grouped: DestinationsByContinent;
      stats: typeof continentStats;
      totalDestinations: number;
    }> = {
      success: true,
      data: {
        grouped: groupedDestinations,
        stats: continentStats,
        totalDestinations: destinations.length
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des destinations groupées:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la récupération des destinations groupées par continent'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
