import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface ExtensionImage {
  id?: number;
  image_url: string;
  alt_text?: string;
  sort_order?: number;
}

export interface OfferExtension {
  id?: number;
  offer_id: number;
  title: string;
  subtitle?: string;
  description?: string;
  duration_days?: number;
  duration_nights?: number;
  price?: number;
  price_currency?: string;
  price_note?: string;
  itinerary?: string;
  sort_order?: number;
  is_active?: boolean;
  images?: ExtensionImage[];
}

// GET - Récupérer toutes les extensions d'une offre
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offerId = parseInt(id);

    if (isNaN(offerId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const extensions = await query(
      `SELECT * FROM offer_extensions 
       WHERE offer_id = ? AND is_active = TRUE 
       ORDER BY sort_order`,
      [offerId]
    ) as any[];

    // Récupérer les images pour chaque extension
    for (const ext of extensions) {
      const images = await query(
        `SELECT * FROM offer_extension_images 
         WHERE extension_id = ? 
         ORDER BY sort_order`,
        [ext.id]
      );
      ext.images = images;
    }

    return NextResponse.json({ data: extensions });
  } catch (error: any) {
    console.error('Erreur récupération extensions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Ajouter une nouvelle extension
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offerId = parseInt(id);

    if (isNaN(offerId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      duration_days,
      duration_nights,
      price,
      price_currency = 'CAD',
      price_note,
      itinerary,
      sort_order = 0,
      images = [],
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO offer_extensions 
       (offer_id, title, subtitle, description, duration_days, duration_nights, price, price_currency, price_note, itinerary, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        offerId,
        title,
        subtitle || null,
        description || null,
        duration_days || null,
        duration_nights || null,
        price || null,
        price_currency,
        price_note || null,
        itinerary || null,
        sort_order,
      ]
    );

    const extensionId = (result as any).insertId;

    // Ajouter les images
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await query(
        `INSERT INTO offer_extension_images (extension_id, image_url, alt_text, sort_order)
         VALUES (?, ?, ?, ?)`,
        [extensionId, img.image_url, img.alt_text || null, i]
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: extensionId, offer_id: offerId, title },
    });
  } catch (error: any) {
    console.error('Erreur création extension:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Mettre à jour toutes les extensions d'une offre (bulk update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offerId = parseInt(id);

    if (isNaN(offerId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const { extensions } = await request.json();

    if (!Array.isArray(extensions)) {
      return NextResponse.json(
        { error: 'extensions doit être un tableau' },
        { status: 400 }
      );
    }

    // Récupérer les IDs existants
    const existingExtensions = await query(
      'SELECT id FROM offer_extensions WHERE offer_id = ?',
      [offerId]
    ) as any[];
    const existingIds = existingExtensions.map(e => e.id);

    // Supprimer les images des extensions existantes
    for (const extId of existingIds) {
      await query('DELETE FROM offer_extension_images WHERE extension_id = ?', [extId]);
    }

    // Supprimer les anciennes extensions
    await query('DELETE FROM offer_extensions WHERE offer_id = ?', [offerId]);

    // Insérer les nouvelles extensions
    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];
      const result = await query(
        `INSERT INTO offer_extensions 
         (offer_id, title, subtitle, description, duration_days, duration_nights, price, price_currency, price_note, itinerary, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          offerId,
          ext.title,
          ext.subtitle || null,
          ext.description || null,
          ext.duration_days || null,
          ext.duration_nights || null,
          ext.price || null,
          ext.price_currency || 'CAD',
          ext.price_note || null,
          ext.itinerary || null,
          i,
        ]
      );

      const extensionId = (result as any).insertId;

      // Ajouter les images
      if (ext.images && Array.isArray(ext.images)) {
        for (let j = 0; j < ext.images.length; j++) {
          const img = ext.images[j];
          await query(
            `INSERT INTO offer_extension_images (extension_id, image_url, alt_text, sort_order)
             VALUES (?, ?, ?, ?)`,
            [extensionId, img.image_url, img.alt_text || null, j]
          );
        }
      }
    }

    return NextResponse.json({ success: true, count: extensions.length });
  } catch (error: any) {
    console.error('Erreur mise à jour extensions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer une extension spécifique (via query param extensionId)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offerId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const extensionId = searchParams.get('extensionId');

    if (isNaN(offerId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    if (extensionId) {
      // Supprimer les images d'abord
      await query('DELETE FROM offer_extension_images WHERE extension_id = ?', [parseInt(extensionId)]);
      // Supprimer l'extension
      await query(
        'DELETE FROM offer_extensions WHERE id = ? AND offer_id = ?',
        [parseInt(extensionId), offerId]
      );
    } else {
      // Supprimer toutes les images des extensions de l'offre
      const extensions = await query(
        'SELECT id FROM offer_extensions WHERE offer_id = ?',
        [offerId]
      ) as any[];
      for (const ext of extensions) {
        await query('DELETE FROM offer_extension_images WHERE extension_id = ?', [ext.id]);
      }
      // Supprimer toutes les extensions de l'offre
      await query('DELETE FROM offer_extensions WHERE offer_id = ?', [offerId]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur suppression extension:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
