import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { PageMetadata } from '@/types';

// GET /api/admin/metadata - Récupérer toutes les métadonnées de pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('page_type');
    const pageSlug = searchParams.get('page_slug');

    let sql = 'SELECT * FROM page_metadata WHERE is_active = 1';
    const params: unknown[] = [];

    if (pageType) {
      sql += ' AND page_type = ?';
      params.push(pageType);
    }

    if (pageSlug) {
      sql += ' AND page_slug = ?';
      params.push(pageSlug);
    }

    sql += ' ORDER BY page_type, page_slug';

    const results = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des métadonnées'
    }, { status: 500 });
  }
}

// POST /api/admin/metadata - Créer de nouvelles métadonnées
export async function POST(request: NextRequest) {
  try {
    const body: PageMetadata = await request.json();

    const {
      page_type,
      page_slug,
      meta_title,
      meta_description,
      meta_keywords,
      og_title,
      og_description,
      og_image,
      og_type = 'website',
      twitter_card = 'summary_large_image',
      twitter_title,
      twitter_description,
      twitter_image,
      canonical_url,
      robots = 'index,follow'
    } = body;

    if (!page_type || !meta_title || !meta_description) {
      return NextResponse.json({
        success: false,
        error: 'Les champs page_type, meta_title et meta_description sont requis'
      }, { status: 400 });
    }

    const sql = `
      INSERT INTO page_metadata (
        page_type, page_slug, meta_title, meta_description, meta_keywords,
        og_title, og_description, og_image, og_type, twitter_card,
        twitter_title, twitter_description, twitter_image, canonical_url, robots
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      page_type, page_slug, meta_title, meta_description, meta_keywords,
      og_title, og_description, og_image, og_type, twitter_card,
      twitter_title, twitter_description, twitter_image, canonical_url, robots
    ]) as { insertId: number };

    return NextResponse.json({
      success: true,
      data: { id: result.insertId, ...body }
    });
  } catch (error: any) {
    console.error('Erreur lors de la création des métadonnées:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({
        success: false,
        error: 'Des métadonnées existent déjà pour cette page'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création des métadonnées'
    }, { status: 500 });
  }
}
