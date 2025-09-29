import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Destination, ApiResponse, DestinationsByContinent } from '@/types';

export async function GET() {
  try {
    // Récupère toutes les destinations actives avec leur continent
    const squery = `
      SELECT 
        id,
        title,
        slug,
        continent,
        short_description,
        banner_image_url,
        price_from,
        price_currency,
        duration_days,
        duration_nights,
        sort_order
      FROM destinations 
      WHERE is_active = 1 
        AND continent IS NOT NULL 
        AND continent != ''
      ORDER BY continent ASC, sort_order ASC, title ASC
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
