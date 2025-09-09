import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { PageMetadata } from '@/types';

// GET /api/admin/metadata/[id] - Récupérer une métadonnée spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'ID invalide'
      }, { status: 400 });
    }

    const results = await query(
      'SELECT * FROM page_metadata WHERE id = ?',
      [id]
    );

    if (!results || (results as unknown[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Métadonnées non trouvées'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: (results as unknown[])[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des métadonnées'
    }, { status: 500 });
  }
}

// PUT /api/admin/metadata/[id] - Mettre à jour une métadonnée
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body: PageMetadata = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'ID invalide'
      }, { status: 400 });
    }

    const {
      page_type,
      page_slug,
      meta_title,
      meta_description,
      meta_keywords,
      og_title,
      og_description,
      og_image,
      og_type,
      twitter_card,
      twitter_title,
      twitter_description,
      twitter_image,
      canonical_url,
      robots,
      is_active
    } = body;

    if (!meta_title || !meta_description) {
      return NextResponse.json({
        success: false,
        error: 'Les champs meta_title et meta_description sont requis'
      }, { status: 400 });
    }

    const sql = `
      UPDATE page_metadata SET
        page_type = ?, page_slug = ?, meta_title = ?, meta_description = ?,
        meta_keywords = ?, og_title = ?, og_description = ?, og_image = ?,
        og_type = ?, twitter_card = ?, twitter_title = ?, twitter_description = ?,
        twitter_image = ?, canonical_url = ?, robots = ?, is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await query(sql, [
      page_type, page_slug, meta_title, meta_description, meta_keywords,
      og_title, og_description, og_image, og_type, twitter_card,
      twitter_title, twitter_description, twitter_image, canonical_url,
      robots, is_active !== undefined ? is_active : true, id
    ]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({
        success: false,
        error: 'Métadonnées non trouvées'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { id, ...body }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des métadonnées:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la mise à jour des métadonnées'
    }, { status: 500 });
  }
}

// DELETE /api/admin/metadata/[id] - Supprimer une métadonnée
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'ID invalide'
      }, { status: 400 });
    }

    const result = await query(
      'DELETE FROM page_metadata WHERE id = ?',
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({
        success: false,
        error: 'Métadonnées non trouvées'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Métadonnées supprimées avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression des métadonnées:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la suppression des métadonnées'
    }, { status: 500 });
  }
}
