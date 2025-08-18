import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  _req: Request,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = await context.params as { slug: string };
    const conn = await pool.getConnection();
    try {
      const [offerRows] = await conn.query(
        'SELECT * FROM offers WHERE slug = ? AND is_active = 1 LIMIT 1',
        [slug]
      );
      const offers = offerRows as any[];
      if (offers.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Offre non trouvée' },
          { status: 404 }
        );
      }
      const offer = offers[0];

      const [types] = await conn.query(
        `SELECT tt.*
         FROM offer_travel_types ott
         JOIN travel_types tt ON tt.id = ott.travel_type_id
         WHERE ott.offer_id = ?`,
        [offer.id]
      );
      const [themes] = await conn.query(
        `SELECT th.*
         FROM offer_travel_themes oth
         JOIN travel_themes th ON th.id = oth.travel_theme_id
         WHERE oth.offer_id = ?`,
        [offer.id]
      );
      const [dests] = await conn.query(
        `SELECT d.*
         FROM offer_destinations od
         JOIN destinations d ON d.id = od.destination_id
         WHERE od.offer_id = ?`,
        [offer.id]
      );
      const [dates] = await conn.query(
        `SELECT * FROM offer_dates WHERE offer_id = ? ORDER BY departure_date ASC`,
        [offer.id]
      );

      const images = [offer.image_banner, offer.image_main].filter(Boolean);
      return NextResponse.json({
        success: true,
        data: {
          ...offer,
          // convenience aliases
          banner_image_url: offer.image_banner ?? offer.banner_image_url,
          image_url: offer.image_main ?? offer.image_url,
          price_from: offer.price_from ?? offer.price ?? null,
          images,
          travel_types: types,
          travel_themes: themes,
          destinations: dests,
          dates,
        },
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Erreur chargement offre:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
