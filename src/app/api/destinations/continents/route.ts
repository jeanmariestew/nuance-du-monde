import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    // Récupère la liste des continents avec le nombre de destinations pour chacun
    const squery = `
      SELECT 
        continent,
        COUNT(*) as destination_count
      FROM destinations 
      WHERE continent IS NOT NULL 
        AND continent != '' 
        AND is_active = 1
      GROUP BY continent 
      ORDER BY continent ASC
    `;

    const rows = await query(squery);
    
    const continents = rows.map((row: any) => ({
      name: row.continent,
      count: row.destination_count
    }));

    const response: ApiResponse<typeof continents> = {
      success: true,
      data: continents
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des continents:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la récupération des continents'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
