import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { TravelTheme, ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const active = searchParams.get('active');

    let query = 'SELECT * FROM travel_themes';
    const params: any[] = [];

    // Filtrer par statut actif si spécifié
    if (active !== null) {
      query += ' WHERE is_active = ?';
      params.push(active === 'true');
    }

    // Ajouter l'ordre
    query += ' ORDER BY sort_order ASC, title ASC';

    // Ajouter la pagination si spécifiée
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
      
      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const [rows] = await pool.execute(query, params);
    const travelThemes = rows as TravelTheme[];

    const response: ApiResponse<TravelTheme[]> = {
      success: true,
      data: travelThemes
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des thèmes de voyage:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la récupération des thèmes de voyage'
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
      sort_order = 0
    } = body;

    if (!title || !slug) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Le titre et le slug sont requis'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const query = `
      INSERT INTO travel_themes (title, slug, description, short_description, image_url, banner_image_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [title, slug, description, short_description, image_url, banner_image_url, sort_order];

    const [result] = await pool.execute(query, params);
    const insertResult = result as any;

    const response: ApiResponse<{ id: number }> = {
      success: true,
      data: { id: insertResult.insertId },
      message: 'Thème de voyage créé avec succès'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du thème de voyage:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la création du thème de voyage'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

