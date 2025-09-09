import { NextResponse } from 'next/server';
import {query} from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const destination = url.searchParams.get('destination'); // slug
    const type = url.searchParams.get('type'); // slug
    const theme = url.searchParams.get('theme'); // slug

    const parts: string[] = [];
    const params: (string | number)[] = [];

    let sql = `SELECT DISTINCT o.*, 
      (SELECT oi.image_url FROM offer_images oi WHERE oi.offer_id = o.id AND oi.image_type = 'main' ORDER BY oi.sort_order LIMIT 1) as image_main,
      (SELECT oi.image_url FROM offer_images oi WHERE oi.offer_id = o.id AND oi.image_type = 'banner' ORDER BY oi.sort_order LIMIT 1) as image_banner
    FROM offers o`;

    if (destination) {
      sql += `\nJOIN offer_destinations od ON od.offer_id = o.id\nJOIN destinations d ON d.id = od.destination_id`;
      parts.push('d.slug = ?');
      params.push(destination);
    }
    if (type) {
      sql += `\nJOIN offer_travel_types ott ON ott.offer_id = o.id\nJOIN travel_types tt ON tt.id = ott.travel_type_id`;
      parts.push('tt.slug = ?');
      params.push(type);
    }
    if (theme) {
      sql += `\nJOIN offer_travel_themes oth ON oth.offer_id = o.id\nJOIN travel_themes th ON th.id = oth.travel_theme_id`;
      parts.push('th.slug = ?');
      params.push(theme);
    }

    sql += `\nWHERE o.is_active = 1`;
    if (parts.length) {
      sql += ` AND ` + parts.join(' AND ');
    }
    sql += `\nORDER BY o.created_at DESC`;

    const rows = await query(sql, params);
    type OfferRow = {
      id: number;
      title: string;
      slug: string;
      short_description?: string;
      description?: string;
      image_main?: string | null;
      image_banner?: string | null;
      price?: number | null;
      price_from?: number | null;
      price_currency?: string | null;
      promotional_price?: number | null;
      promotional_price_currency?: string | null;
      promotion_start_date?: string | null;
      promotion_end_date?: string | null;
      promotion_description?: string | null;
      price_includes?: string | null;
      price_excludes?: string | null;
      duration_days?: number | null;
      duration_nights?: number | null;
      banner_image_url?: string | null;
      image_url?: string | null;
      [key: string]: unknown;
    };
    
    // Fetch available dates and images for all offers
    const offerIds = (rows as OfferRow[]).map(o => o.id);
    let availableDatesMap: Record<number, string[]> = {};
    let imagesMap: Record<number, any[]> = {};
    
    if (offerIds.length > 0) {
      const datesRows = await query(
        `SELECT offer_id, departure_date FROM offer_dates WHERE offer_id IN (${offerIds.map(() => '?').join(',')}) ORDER BY departure_date`,
        offerIds
      );
      availableDatesMap = (datesRows as any[]).reduce((acc, row) => {
        if (!acc[row.offer_id]) acc[row.offer_id] = [];
        acc[row.offer_id].push(row.departure_date);
        return acc;
      }, {} as Record<number, string[]>);
      
      // Fetch all images for offers
      const imagesRows = await query(
        `SELECT offer_id, image_url, image_type, alt_text, sort_order FROM offer_images WHERE offer_id IN (${offerIds.map(() => '?').join(',')}) ORDER BY sort_order, id`,
        offerIds
      );
      imagesMap = (imagesRows as any[]).reduce((acc, row) => {
        if (!acc[row.offer_id]) acc[row.offer_id] = [];
        acc[row.offer_id].push(row);
        return acc;
      }, {} as Record<number, any[]>);
    }
    
    const data = (rows as OfferRow[]).map((o) => {
      const offerImages = imagesMap[o.id] || [];
      const mainImage = offerImages.find(img => img.image_type === 'main')?.image_url || o.image_main;
      const bannerImage = offerImages.find(img => img.image_type === 'banner')?.image_url || o.image_banner;
      
      return {
        ...o,
        // convenience aliases for frontend components
        banner_image_url: bannerImage,
        image_url: mainImage,
        price_from: o.price_from ?? o.price ?? null,
        available_dates: availableDatesMap[o.id] || [],
        images: offerImages,
      };
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur liste offres:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
