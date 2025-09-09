import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const rows = await query(
    `SELECT d.*, COALESCE(cnt.c, 0) AS offer_count
     FROM destinations d
     LEFT JOIN (
       SELECT destination_id, COUNT(*) AS c
       FROM offer_destinations
       GROUP BY destination_id
     ) cnt ON cnt.destination_id = d.id
     ORDER BY d.created_at DESC`
  );
  return NextResponse.json({ success: true, data: rows });
}

export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({} as any));
  const {
    title,
    slug,
    description = null,
    short_description = null,
    image_url = null,
    banner_image_url = null,
    price_from = null,
    price_currency = 'CAD',
    duration_days = null,
    duration_nights = null,
    group_size_min = null,
    group_size_max = null,
    available_dates = null,
    sort_order = 0,
    is_active = 1,
    meta_title = null,
    meta_description = null,
    meta_keywords = null,
    og_title = null,
    og_description = null,
    og_image = null,
    canonical_url = null,
  } = body || {};

  if (!title || !slug) return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });

  try {
    const res = await execute(
      'INSERT INTO destinations (title, slug, description, short_description, image_url, banner_image_url, price_from, price_currency, duration_days, duration_nights, group_size_min, group_size_max, available_dates, sort_order, is_active, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title, slug, description, short_description, image_url, banner_image_url,
        price_from, price_currency, duration_days, duration_nights,
        group_size_min, group_size_max, available_dates ? JSON.stringify(available_dates) : null,
        sort_order, is_active ? 1 : 0,
        meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url,
      ]
    );
    return NextResponse.json({ success: true, id: res.insertId });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
