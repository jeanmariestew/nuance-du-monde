import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Testimonial, ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');

    let query = `
      SELECT t.*, d.title as destination_title, th.title as theme_title
      FROM testimonials t
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN travel_themes th ON t.travel_theme_id = th.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    // Filtrer par statut actif si spécifié
    if (active !== null) {
      conditions.push('t.is_active = ?');
      params.push(active === 'true');
    }

    // Filtrer par témoignages en vedette si spécifié
    if (featured !== null) {
      conditions.push('t.is_featured = ?');
      params.push(featured === 'true');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Ajouter l'ordre
    query += ' ORDER BY t.is_featured DESC, t.created_at DESC';

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
    const testimonials = rows as Testimonial[];

    const response: ApiResponse<Testimonial[]> = {
      success: true,
      data: testimonials
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des témoignages:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la récupération des témoignages'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      client_name,
      client_avatar,
      testimonial_text,
      rating,
      destination_id,
      travel_theme_id,
      is_featured = false
    } = body;

    if (!client_name || !testimonial_text) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Le nom du client et le témoignage sont requis'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const query = `
      INSERT INTO testimonials (client_name, client_avatar, testimonial_text, rating, destination_id, travel_theme_id, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [client_name, client_avatar, testimonial_text, rating, destination_id, travel_theme_id, is_featured];

    const [result] = await pool.execute(query, params);
    const insertResult = result as any;

    const response: ApiResponse<{ id: number }> = {
      success: true,
      data: { id: insertResult.insertId },
      message: 'Témoignage créé avec succès'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du témoignage:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la création du témoignage'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

