import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

const uploadsDir = '/var/www/nextapp/nuance-du-monde/public/uploads';

// GET - Récupérer une image spécifique
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const images = await query(
      'SELECT * FROM images WHERE id = ?',
      [id]
    ) as any[];

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Image non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: images[0]
    });
  } catch (error: any) {
    console.error('Gallery GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les métadonnées d'une image
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, alt_text, tags } = body;

    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }

    if (alt_text !== undefined) {
      updates.push('alt_text = ?');
      values.push(alt_text);
    }

    if (tags !== undefined) {
      updates.push('tags = ?');
      values.push(tags);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucune donnée à mettre à jour' },
        { status: 400 }
      );
    }

    values.push(id);

    await query(
      `UPDATE images SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Récupérer l'image mise à jour
    const images = await query(
      'SELECT * FROM images WHERE id = ?',
      [id]
    ) as any[];

    return NextResponse.json({
      success: true,
      data: images[0]
    });
  } catch (error: any) {
    console.error('Gallery PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une image
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Récupérer l'image pour obtenir le nom du fichier
    const images = await query(
      'SELECT * FROM images WHERE id = ?',
      [id]
    ) as any[];

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Image non trouvée' },
        { status: 404 }
      );
    }

    const image = images[0];

    // Supprimer le fichier physique
    try {
      const filePath = path.join(uploadsDir, image.filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Erreur lors de la suppression du fichier:', error);
      // Continue même si le fichier n'existe pas
    }

    // Supprimer de la base de données
    await query('DELETE FROM images WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Image supprimée avec succès'
    });
  } catch (error: any) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
