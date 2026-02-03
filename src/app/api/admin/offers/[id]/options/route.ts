import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface DayOption {
  id?: number;
  offer_id: number;
  day_number: number;
  title: string;
  description?: string;
  image_url?: string;
  price_supplement?: number;
  price_currency?: string;
  is_included?: boolean;
  sort_order?: number;
  is_active?: boolean;
}

// GET - Récupérer toutes les options d'une offre
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

    const options = await query(
      `SELECT * FROM offer_day_options 
       WHERE offer_id = ? AND is_active = TRUE 
       ORDER BY day_number, sort_order`,
      [offerId]
    );

    return NextResponse.json({ data: options });
  } catch (error: any) {
    console.error('Erreur récupération options:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Ajouter une nouvelle option
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
      day_number,
      title,
      description,
      image_url,
      price_supplement,
      price_currency = 'CAD',
      is_included = false,
      sort_order = 0,
    } = body;

    if (!day_number || !title) {
      return NextResponse.json(
        { error: 'day_number et title sont requis' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO offer_day_options 
       (offer_id, day_number, title, description, image_url, price_supplement, price_currency, is_included, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        offerId,
        day_number,
        title,
        description || null,
        image_url || null,
        price_supplement || null,
        price_currency,
        is_included ? 1 : 0,
        sort_order,
      ]
    );

    const insertId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      data: { id: insertId, offer_id: offerId, day_number, title },
    });
  } catch (error: any) {
    console.error('Erreur création option:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Mettre à jour toutes les options d'une offre (bulk update)
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

    const { options } = await request.json();

    if (!Array.isArray(options)) {
      return NextResponse.json(
        { error: 'options doit être un tableau' },
        { status: 400 }
      );
    }

    // Supprimer les anciennes options
    await query('DELETE FROM offer_day_options WHERE offer_id = ?', [offerId]);

    // Insérer les nouvelles options
    for (const opt of options) {
      await query(
        `INSERT INTO offer_day_options 
         (offer_id, day_number, title, description, image_url, price_supplement, price_currency, is_included, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          offerId,
          opt.day_number,
          opt.title,
          opt.description || null,
          opt.image_url || null,
          opt.price_supplement || null,
          opt.price_currency || 'CAD',
          opt.is_included ? 1 : 0,
          opt.sort_order || 0,
        ]
      );
    }

    return NextResponse.json({ success: true, count: options.length });
  } catch (error: any) {
    console.error('Erreur mise à jour options:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer une option spécifique (via query param optionId)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offerId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const optionId = searchParams.get('optionId');

    if (isNaN(offerId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    if (optionId) {
      // Supprimer une option spécifique
      await query(
        'DELETE FROM offer_day_options WHERE id = ? AND offer_id = ?',
        [parseInt(optionId), offerId]
      );
    } else {
      // Supprimer toutes les options de l'offre
      await query('DELETE FROM offer_day_options WHERE offer_id = ?', [offerId]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur suppression option:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
