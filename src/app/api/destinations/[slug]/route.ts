import { NextRequest, NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { Destination, ApiResponse } from '@/types';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const squery = 'SELECT * FROM destinations WHERE slug = ? AND is_active = true';
    const rows = await query(squery, [slug]);
    const destinations = rows as Destination[];

    if (destinations.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Destination non trouvée'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const destination = destinations[0];

    // Parser les dates disponibles si elles existent
    if (destination.available_dates && typeof destination.available_dates === 'string') {
      try {
        destination.available_dates = JSON.parse(destination.available_dates);
      } catch (e) {
        destination.available_dates = [];
      }
    }

    const response: ApiResponse<Destination> = {
      success: true,
      data: destination
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération de la destination:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la récupération de la destination'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const {
      title,
      description,
      short_description,
      image_url,
      banner_image_url,
      price_from,
      price_currency,
      duration_days,
      duration_nights,
      group_size_min,
      group_size_max,
      available_dates,
      sort_order,
      is_active
    } = body;

    const squery = `
      UPDATE destinations SET
        title = ?, description = ?, short_description = ?, image_url = ?,
        banner_image_url = ?, price_from = ?, price_currency = ?,
        duration_days = ?, duration_nights = ?, group_size_min = ?,
        group_size_max = ?, available_dates = ?, sort_order = ?,
        is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `;

    const params = [
      title, description, short_description, image_url, banner_image_url,
      price_from, price_currency, duration_days, duration_nights,
      group_size_min, group_size_max,
      available_dates ? JSON.stringify(available_dates) : null,
      sort_order, is_active, slug
    ];

    const result = await query(squery, params);
    const updateResult = result as any;

    if (updateResult.affectedRows === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Destination non trouvée'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Destination mise à jour avec succès'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la destination:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la mise à jour de la destination'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const squery = 'DELETE FROM destinations WHERE slug = ?';
    const result = await query(squery, [slug]);
    const deleteResult = result as any;

    if (deleteResult.affectedRows === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Destination non trouvée'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Destination supprimée avec succès'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la suppression de la destination:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la suppression de la destination'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

