import { NextRequest, NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { Destination, ApiResponse } from '@/types';
import type { ResultSetHeader } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const active = searchParams.get('active');

    let squery = 'SELECT * FROM destinations';
    const params: (string | number)[] = [];

    // Filtrer par statut actif si spécifié
    if (active !== null) {
      squery += ' WHERE is_active = ?';
      params.push(active === 'true' ? 1 : 0);
    }

    // Ajouter l'ordre
    squery += ' ORDER BY sort_order ASC, title ASC';

    // Ajouter la pagination si spécifiée
    if (limit) {
      const nLimit = Math.max(0, parseInt(limit, 10) || 0);
      squery += ` LIMIT ${nLimit}`;
      if (offset) {
        const nOffset = Math.max(0, parseInt(offset, 10) || 0);
        squery += ` OFFSET ${nOffset}`;
      }
    }

    const rows = await query(squery, params);
    const destinations = rows as Destination[];

    const response: ApiResponse<Destination[]> = {
      success: true,
      data: destinations
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des destinations:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la récupération des destinations'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      short_description,
      image_url,
      banner_image_url,
      price_from,
      price_currency = 'CAD',
      duration_days,
      duration_nights,
      group_size_min,
      group_size_max,
      available_dates,
      sort_order = 0
    } = body;

    if (!title || !slug) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Le titre et le slug sont requis'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const squery = `
      INSERT INTO destinations (
        title, slug, description, short_description, image_url, banner_image_url,
        price_from, price_currency, duration_days, duration_nights,
        group_size_min, group_size_max, available_dates, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      title, slug, description, short_description, image_url, banner_image_url,
      price_from, price_currency, duration_days, duration_nights,
      group_size_min, group_size_max, available_dates ? JSON.stringify(available_dates) : null,
      sort_order
    ];

    const result = await query(squery, params);
    const insertResult = result as ResultSetHeader;

    const response: ApiResponse<{ id: number }> = {
      success: true,
      data: { id: insertResult.insertId },
      message: 'Destination créée avec succès'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la destination:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la création de la destination'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

