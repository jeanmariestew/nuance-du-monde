import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

// List offers (basic fields)
export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const [rows] = await pool.query(
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
    image_url = '',
    is_active = 1,
    price = null,
    price_currency = 'EUR',
    typeIds = [] as number[],
    themeIds = [] as number[],
    destinationIds = [] as number[],
  } = body || {};

  if (!title || !slug) return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [res]: any = await conn.query(
      `INSERT INTO offers (title, slug, short_description, description, image_main, is_active, price, price_currency)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, summary, description, image_url, is_active ? 1 : 0, price, price_currency]
    );
    const offerId = res.insertId as number;

    if (Array.isArray(typeIds) && typeIds.length) {
      await conn.query(
        `INSERT IGNORE INTO offer_travel_types (offer_id, travel_type_id)
         VALUES ${typeIds.map(() => '(?, ?)').join(', ')}`,
        typeIds.flatMap((id: number) => [offerId, id])
      );
    }
    if (Array.isArray(themeIds) && themeIds.length) {
      await conn.query(
        `INSERT IGNORE INTO offer_travel_themes (offer_id, travel_theme_id)
         VALUES ${themeIds.map(() => '(?, ?)').join(', ')}`,
        themeIds.flatMap((id: number) => [offerId, id])
      );
    }
    if (Array.isArray(destinationIds) && destinationIds.length) {
      await conn.query(
        `INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
         VALUES ${destinationIds.map(() => '(?, ?)').join(', ')}`,
        destinationIds.flatMap((id: number) => [offerId, id])
      );
    }

    await conn.commit();
    return NextResponse.json({ success: true, id: offerId });
  } catch (e: any) {
    await conn.rollback();
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    conn.release();
  }
}
