import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface HotelImage {
  id?: number;
  image_url: string;
  alt_text?: string;
  sort_order?: number;
}

export interface OfferHotel {
  id?: number;
  offer_id: number;
  name: string;
  location?: string;
  description?: string;
  sort_order?: number;
  is_active?: boolean;
  images?: HotelImage[];
}

// GET - Récupérer tous les hôtels d'une offre
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

    const hotels = await query(
      `SELECT * FROM offer_hotels
       WHERE offer_id = ? AND is_active = TRUE
       ORDER BY sort_order`,
      [offerId]
    ) as any[];

    for (const hotel of hotels) {
      const images = await query(
        `SELECT * FROM offer_hotel_images
         WHERE hotel_id = ?
         ORDER BY sort_order`,
        [hotel.id]
      );
      hotel.images = images;
    }

    return NextResponse.json({ data: hotels });
  } catch (error: any) {
    console.error('Erreur récupération hôtels:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Ajouter un nouvel hôtel
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
      name,
      location,
      description,
      sort_order = 0,
      images = [],
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Le nom de l\'hôtel est requis' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO offer_hotels (offer_id, name, location, description, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [offerId, name, location || null, description || null, sort_order]
    );

    const hotelId = (result as any).insertId;

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await query(
        `INSERT INTO offer_hotel_images (hotel_id, image_url, alt_text, sort_order)
         VALUES (?, ?, ?, ?)`,
        [hotelId, img.image_url, img.alt_text || null, i]
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: hotelId, offer_id: offerId, name },
    });
  } catch (error: any) {
    console.error('Erreur création hôtel:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Mettre à jour tous les hôtels d'une offre (bulk update)
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

    const { hotels } = await request.json();

    if (!Array.isArray(hotels)) {
      return NextResponse.json(
        { error: 'hotels doit être un tableau' },
        { status: 400 }
      );
    }

    const existingHotels = await query(
      'SELECT id FROM offer_hotels WHERE offer_id = ?',
      [offerId]
    ) as any[];
    const existingIds = existingHotels.map(h => h.id);

    for (const hotelId of existingIds) {
      await query('DELETE FROM offer_hotel_images WHERE hotel_id = ?', [hotelId]);
    }

    await query('DELETE FROM offer_hotels WHERE offer_id = ?', [offerId]);

    for (let i = 0; i < hotels.length; i++) {
      const hotel = hotels[i];
      const result = await query(
        `INSERT INTO offer_hotels (offer_id, name, location, description, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [offerId, hotel.name, hotel.location || null, hotel.description || null, i]
      );

      const hotelId = (result as any).insertId;

      if (hotel.images && Array.isArray(hotel.images)) {
        for (let j = 0; j < hotel.images.length; j++) {
          const img = hotel.images[j];
          await query(
            `INSERT INTO offer_hotel_images (hotel_id, image_url, alt_text, sort_order)
             VALUES (?, ?, ?, ?)`,
            [hotelId, img.image_url, img.alt_text || null, j]
          );
        }
      }
    }

    return NextResponse.json({ success: true, count: hotels.length });
  } catch (error: any) {
    console.error('Erreur mise à jour hôtels:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer un hôtel spécifique (via query param hotelId)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offerId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');

    if (isNaN(offerId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    if (hotelId) {
      await query('DELETE FROM offer_hotel_images WHERE hotel_id = ?', [parseInt(hotelId)]);
      await query(
        'DELETE FROM offer_hotels WHERE id = ? AND offer_id = ?',
        [parseInt(hotelId), offerId]
      );
    } else {
      const hotels = await query(
        'SELECT id FROM offer_hotels WHERE offer_id = ?',
        [offerId]
      ) as any[];
      for (const hotel of hotels) {
        await query('DELETE FROM offer_hotel_images WHERE hotel_id = ?', [hotel.id]);
      }
      await query('DELETE FROM offer_hotels WHERE offer_id = ?', [offerId]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur suppression hôtel:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
