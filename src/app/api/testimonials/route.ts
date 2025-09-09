import { NextRequest, NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { Testimonial, ApiResponse } from '@/types';
import type { ResultSetHeader } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');
    const published = searchParams.get('published');

    let squery = `
      SELECT t.*, d.title as destination_title, th.title as theme_title
      FROM testimonials t
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN travel_themes th ON t.travel_theme_id = th.id
    `;
    const params: (string | number)[] = [];
    const conditions: string[] = [];

    // Filtrer par statut actif si spécifié
    if (active !== null) {
      conditions.push('t.is_active = ?');
      params.push(active === 'true' ? 1 : 0);
    }

    // Filtrer par témoignages en vedette si spécifié
    if (featured !== null) {
      conditions.push('t.is_featured = ?');
      params.push(featured === 'true' ? 1 : 0);
    }

    // Filtrer par publication si spécifié
    if (published !== null) {
      conditions.push('t.is_published = ?');
      params.push(published === 'true' ? 1 : 0);
    }

    if (conditions.length > 0) {
      squery += ' WHERE ' + conditions.join(' AND ');
    }

    // Ajouter l'ordre
    squery += ' ORDER BY t.is_featured DESC, t.created_at DESC';

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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      client_name,
      client_avatar,
      image_url,
      testimonial_text,
      rating,
      destination_id,
      travel_theme_id,
      is_featured,
      is_published,
      is_active
    } = body as Partial<{
      id: number;
      client_name: string;
      client_avatar: string | null;
      image_url: string | null;
      testimonial_text: string;
      rating: number | null;
      destination_id: number | null;
      travel_theme_id: number | null;
      is_featured: boolean;
      is_published: boolean;
      is_active: boolean;
    }>;

    if (!id) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ID du témoignage requis'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    const pushField = <T,>(col: string, val: T | undefined, transform?: (v: T) => string | number | null) => {
      if (typeof val === 'undefined') return;
      fields.push(`${col} = ?`);
      params.push(transform ? transform(val) : ((val as unknown) as string | number | null));
    };

    pushField('client_name', client_name);
    pushField('client_avatar', client_avatar ?? null);
    pushField('image_url', image_url ?? null);
    pushField('testimonial_text', testimonial_text);
    pushField('rating', typeof rating === 'number' ? rating : rating ?? null);
    pushField('destination_id', typeof destination_id === 'number' ? destination_id : destination_id ?? null);
    pushField('travel_theme_id', typeof travel_theme_id === 'number' ? travel_theme_id : travel_theme_id ?? null);
    pushField('is_featured', is_featured, (v) => (v ? 1 : 0));
    pushField('is_published', is_published, (v) => (v ? 1 : 0));
    pushField('is_active', is_active, (v) => (v ? 1 : 0));

    if (fields.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Aucun champ à mettre à jour'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const squery = `UPDATE testimonials SET ${fields.join(', ')} WHERE id = ?`;
    params.push(Number(id));

    await query(squery, params);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Témoignage mis à jour avec succès'
    } as ApiResponse<null>;
    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du témoignage:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la mise à jour du témoignage'
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
      image_url,
      testimonial_text,
      rating,
      destination_id,
      travel_theme_id,
      is_featured = false,
      is_published = true,
      is_active = true
    } = body;

    if (!client_name || !testimonial_text) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Le nom du client et le témoignage sont requis'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const squery = `
      INSERT INTO testimonials (client_name, client_avatar, image_url, testimonial_text, rating, destination_id, travel_theme_id, is_featured, is_published, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params: (string | number | null | boolean)[] = [
      client_name,
      client_avatar || null,
      image_url || null,
      testimonial_text,
      rating ?? null,
      destination_id ?? null,
      travel_theme_id ?? null,
      is_featured ? 1 : 0,
      is_published ? 1 : 0,
      is_active ? 1 : 0
    ];

    const result = await query(squery, params);
    const insertResult = result as unknown as ResultSetHeader;

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

