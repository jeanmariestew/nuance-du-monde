import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const destination = url.searchParams.get('destination'); // slug
    const type = url.searchParams.get('type'); // slug
    const theme = url.searchParams.get('theme'); // slug

    const parts: string[] = [];
    const params: (string | number)[] = [];

    let sql = `SELECT DISTINCT o.* FROM offers o`;

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

    const [rows] = await pool.query(sql, params);
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
      duration_days?: number | null;
      duration_nights?: number | null;
      banner_image_url?: string | null;
      image_url?: string | null;
      [key: string]: unknown;
    };
    
    // Fetch available dates for all offers
    const offerIds = (rows as OfferRow[]).map(o => o.id);
    let availableDatesMap: Record<number, string[]> = {};
    
    if (offerIds.length > 0) {
      const [datesRows] = await pool.query(
        `SELECT offer_id, departure_date FROM offer_dates WHERE offer_id IN (${offerIds.map(() => '?').join(',')}) ORDER BY departure_date`,
        offerIds
      );
      availableDatesMap = (datesRows as any[]).reduce((acc, row) => {
        if (!acc[row.offer_id]) acc[row.offer_id] = [];
        acc[row.offer_id].push(row.departure_date);
        return acc;
      }, {} as Record<number, string[]>);
    }
    
    const data = (rows as OfferRow[]).map((o) => {
      const images = [o.image_banner, o.image_main].filter(Boolean) as string[];
      return {
        ...o,
        // convenience aliases for frontend components
        banner_image_url: o.image_banner ?? o.banner_image_url,
        image_url: o.image_main ?? o.image_url,
        price_from: o.price_from ?? o.price ?? null,
        available_dates: availableDatesMap[o.id] || [],
        images,
      };
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur liste offres:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
