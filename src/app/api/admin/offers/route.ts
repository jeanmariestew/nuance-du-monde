import { NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

// List offers (basic fields)
export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const rows = await query(
    `SELECT id, title, slug, is_active, price, price_currency, image_main AS image_url, created_at
     FROM offers ORDER BY created_at DESC`
  );
  return NextResponse.json({ success: true, data: rows });
}

// Create offer with relations
export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({} as any));
  const {
    title,
    slug,
    summary = '',
    description = '',
    images = [] as any[],
    is_active = 1,
    price = null,
    price_currency = 'EUR',
    promotional_price = null,
    promotional_price_currency = 'EUR',
    promotion_start_date = null,
    promotion_end_date = null,
    promotion_description = null,
    price_includes = null,
    price_excludes = null,
    label = null,
    duration_days = null,
    duration_nights = null,
    available_dates = [] as string[],
    typeIds = [] as number[],
    themeIds = [] as number[],
    destinationIds = [] as number[],
  } = body || {};

  if (!title || !slug) return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });

  try {
    const [res]: any = await query(
      `INSERT INTO offers (title, slug, short_description, description, is_active, price, price_currency, promotional_price, promotional_price_currency, promotion_start_date, promotion_end_date, promotion_description, price_includes, price_excludes, label, duration_days, duration_nights)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, summary, description, is_active ? 1 : 0, price, price_currency, promotional_price, promotional_price_currency, promotion_start_date, promotion_end_date, promotion_description, price_includes, price_excludes, label, duration_days, duration_nights]
    );
    const offerId = res.insertId as number;

    if (Array.isArray(typeIds) && typeIds.length) {
      await query(
        `INSERT IGNORE INTO offer_travel_types (offer_id, travel_type_id)
         VALUES ${typeIds.map(() => '(?, ?)').join(', ')}`,
        typeIds.flatMap((id: number) => [offerId, id])
      );
    }
    if (Array.isArray(themeIds) && themeIds.length) {
      await query(
        `INSERT IGNORE INTO offer_travel_themes (offer_id, travel_theme_id)
         VALUES ${themeIds.map(() => '(?, ?)').join(', ')}`,
        themeIds.flatMap((id: number) => [offerId, id])
      );
    }
    if (Array.isArray(destinationIds) && destinationIds.length) {
      await query(
        `INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
         VALUES ${destinationIds.map(() => '(?, ?)').join(', ')}`,
        destinationIds.flatMap((id: number) => [offerId, id])
      );
    }

    // Save available dates
    if (Array.isArray(available_dates) && available_dates.length > 0) {
      const validDates = available_dates.filter(date => date && date.trim());
      if (validDates.length > 0) {
        const placeholders = validDates.map(() => '(?, ?)').join(', ');
        const values = validDates.flatMap((date: string) => [offerId, date]);
        await query(
          `INSERT INTO offer_dates (offer_id, departure_date) VALUES ${placeholders}`,
          values
        );
      }
    }

    // Save images
    if (Array.isArray(images) && images.length > 0) {
      const validImages = images.filter(img => img && img.image_url);
      if (validImages.length > 0) {
        const placeholders = validImages.map(() => '(?, ?, ?, ?, ?)').join(', ');
        const values = validImages.flatMap((img: any, index: number) => [
          offerId,
          img.image_url,
          img.image_type || 'gallery',
          img.alt_text || '',
          img.sort_order !== undefined ? img.sort_order : index
        ]);
        await query(
          `INSERT INTO offer_images (offer_id, image_url, image_type, alt_text, sort_order) VALUES ${placeholders}`,
          values
        );
      }
    }

    return NextResponse.json({ success: true, data: { id: offerId } });
  }catch(e){
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
