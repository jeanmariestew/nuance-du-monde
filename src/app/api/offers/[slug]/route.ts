import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
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

    const typesResult = await query(
      `SELECT tt.*
       FROM offer_travel_types ott
       JOIN travel_types tt ON tt.id = ott.travel_type_id
       WHERE ott.offer_id = ?`,
      [offer.id]
    );
    const themesResult = await query(
      `SELECT th.*
       FROM offer_travel_themes oth
       JOIN travel_themes th ON th.id = oth.travel_theme_id
       WHERE oth.offer_id = ?`,
      [offer.id]
    );
    const destsResult = await query(
      `SELECT d.*
       FROM offer_destinations od
       JOIN destinations d ON d.id = od.destination_id
       WHERE od.offer_id = ?`,
      [offer.id]
    );
    const datesResult = await query(
      `SELECT * FROM offer_dates WHERE offer_id = ? ORDER BY departure_date ASC`,
      [offer.id]
    );
    const imagesResult = await query(
      `SELECT oi.id, i.url as image_url, oi.image_type, oi.alt_text, oi.sort_order 
       FROM offer_images oi
       JOIN images i ON oi.image_id = i.id
       WHERE oi.offer_id = ? 
       ORDER BY oi.sort_order, oi.id`,
      [offer.id]
    );

    const types = typesResult as any[];
    const themes = themesResult as any[];
    const dests = destsResult as any[];
    const dates = datesResult as any[];
    const images = imagesResult as any[];

    const mainImage = images?.find(img => img.image_type === 'main')?.image_url || offer.image_main;
    const bannerImage = images?.find(img => img.image_type === 'banner')?.image_url || offer.image_banner;
    const availableDates = dates?.map(d => d.departure_date) || [];
    
    // Parse coordinates JSON if present
    let coordinates = null;
    if (offer.coordinates) {
      try {
        coordinates = typeof offer.coordinates === 'string' 
          ? JSON.parse(offer.coordinates) 
          : offer.coordinates;
      } catch (e) {
        console.error('Error parsing coordinates:', e);
      }
    }
    
    // Parse map_center JSON if present
    let map_center = null;
    if (offer.map_center) {
      try {
        map_center = typeof offer.map_center === 'string' 
          ? JSON.parse(offer.map_center) 
          : offer.map_center;
      } catch (e) {
        console.error('Error parsing map_center:', e);
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...offer,
        coordinates,
        map_center,
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
  } catch (error) {
    console.error('Erreur chargement offre:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
