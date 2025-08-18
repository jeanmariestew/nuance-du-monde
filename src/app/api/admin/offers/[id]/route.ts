import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
  const [offers] = await pool.query('SELECT * FROM offers WHERE id = ?', [id]);
  if ((offers as any[]).length === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  const row = (offers as any[])[0];
  const offer = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.short_description || '',
    description: row.description || '',
    image_url: row.image_main || '',
    is_active: row.is_active,
    price: row.price,
    price_currency: row.price_currency,
  } as any;
  const [types] = await pool.query('SELECT travel_type_id FROM offer_travel_types WHERE offer_id = ?', [id]);
  const [themes] = await pool.query('SELECT travel_theme_id FROM offer_travel_themes WHERE offer_id = ?', [id]);
  const [dests] = await pool.query('SELECT destination_id FROM offer_destinations WHERE offer_id = ?', [id]);
  return NextResponse.json({ success: true, data: {
    ...offer,
    typeIds: (types as any[]).map(r => r.travel_type_id),
    themeIds: (themes as any[]).map(r => r.travel_theme_id),
    destinationIds: (dests as any[]).map(r => r.destination_id),
  }});
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
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
    await conn.query(
      `UPDATE offers SET title=?, slug=?, short_description=?, description=?, image_main=?, is_active=?, price=?, price_currency=? WHERE id=?`,
      [title, slug, summary, description, image_url, is_active ? 1 : 0, price, price_currency, id]
    );

    await conn.query('DELETE FROM offer_travel_types WHERE offer_id = ?', [id]);
    await conn.query('DELETE FROM offer_travel_themes WHERE offer_id = ?', [id]);
    await conn.query('DELETE FROM offer_destinations WHERE offer_id = ?', [id]);

    if (Array.isArray(typeIds) && typeIds.length) {
      await conn.query(
        `INSERT IGNORE INTO offer_travel_types (offer_id, travel_type_id)
         VALUES ${typeIds.map(() => '(?, ?)').join(', ')}`,
        typeIds.flatMap((tid: number) => [id, tid])
      );
    }
    if (Array.isArray(themeIds) && themeIds.length) {
      await conn.query(
        `INSERT IGNORE INTO offer_travel_themes (offer_id, travel_theme_id)
         VALUES ${themeIds.map(() => '(?, ?)').join(', ')}`,
        themeIds.flatMap((tid: number) => [id, tid])
      );
    }
    if (Array.isArray(destinationIds) && destinationIds.length) {
      await conn.query(
        `INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
         VALUES ${destinationIds.map(() => '(?, ?)').join(', ')}`,
        destinationIds.flatMap((did: number) => [id, did])
      );
    }

    await conn.commit();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    await conn.rollback();
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    conn.release();
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM offer_travel_types WHERE offer_id = ?', [id]);
    await conn.query('DELETE FROM offer_travel_themes WHERE offer_id = ?', [id]);
    await conn.query('DELETE FROM offer_destinations WHERE offer_id = ?', [id]);
    await conn.query('DELETE FROM offer_dates WHERE offer_id = ?', [id]);
    await conn.query('DELETE FROM offers WHERE id = ?', [id]);
    await conn.commit();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    await conn.rollback();
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
    conn.release();
  }
}
