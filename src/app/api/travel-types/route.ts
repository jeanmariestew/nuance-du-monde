import { NextRequest, NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { TravelType, ApiResponse } from '@/types';
import type { ResultSetHeader } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const active = searchParams.get('active');

    let squery = 'SELECT * FROM travel_types';
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
    const travelTypes = rows as TravelType[];

    const response: ApiResponse<TravelType[]> = {
      success: true,
      data: travelTypes
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des types de voyage:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la récupération des types de voyage'
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
      INSERT INTO travel_types (title, slug, description, short_description, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [title, slug, description, short_description, image_url, sort_order];

    const result = await query(squery, params);
    const insertResult = result as ResultSetHeader;

    const response: ApiResponse<{ id: number }> = {
      success: true,
      data: { id: insertResult.insertId },
      message: 'Type de voyage créé avec succès'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du type de voyage:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la création du type de voyage'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

