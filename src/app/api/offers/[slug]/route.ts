import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    try {
      const offerRows = await query(
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

      const [types] = await query(
        `SELECT tt.*
         FROM offer_travel_types ott
         JOIN travel_types tt ON tt.id = ott.travel_type_id
         WHERE ott.offer_id = ?`,
        [offer.id]
      );
      const [themes] = await query(
        `SELECT th.*
         FROM offer_travel_themes oth
         JOIN travel_themes th ON th.id = oth.travel_theme_id
         WHERE oth.offer_id = ?`,
        [offer.id]
      );
      const [dests] = await query(
        `SELECT d.*
         FROM offer_destinations od
         JOIN destinations d ON d.id = od.destination_id
         WHERE od.offer_id = ?`,
        [offer.id]
      );
      const [dates] = await query(
        `SELECT * FROM offer_dates WHERE offer_id = ? ORDER BY departure_date ASC`,
        [offer.id]
      );
      const [images] = await query(
        `SELECT id, image_url, image_type, alt_text, sort_order FROM offer_images WHERE offer_id = ? ORDER BY sort_order, id`,
        [offer.id]
      );

      const mainImage = (images as any[]).find(img => img.image_type === 'main')?.image_url || offer.image_main;
      const bannerImage = (images as any[]).find(img => img.image_type === 'banner')?.image_url || offer.image_banner;
      const availableDates = (dates as any[]).map(d => d.departure_date);
      
      return NextResponse.json({
        success: true,
        data: {
          ...offer,
          // convenience aliases
          banner_image_url: bannerImage,
          image_url: mainImage,
          price_from: offer.price_from ?? offer.price ?? null,
          available_dates: availableDates,
          images: images as any[],
          travel_types: types,
          travel_themes: themes,
          destinations: dests,
          dates,
        },
      });
    }
  } catch (error) {
    console.error('Erreur chargement offre:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
