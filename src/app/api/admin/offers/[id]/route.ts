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
    is_active: row.is_active,
    price: row.price,
    price_currency: row.price_currency,
    promotional_price: row.promotional_price,
    promotional_price_currency: row.promotional_price_currency,
    promotion_start_date: row.promotion_start_date,
    promotion_end_date: row.promotion_end_date,
    promotion_description: row.promotion_description,
    price_includes: row.price_includes,
    price_excludes: row.price_excludes,
    label: row.label,
    duration_days: row.duration_days,
    duration_nights: row.duration_nights,
  } as any;
  const [types] = await pool.query('SELECT travel_type_id FROM offer_travel_types WHERE offer_id = ?', [id]);
  const [themes] = await pool.query('SELECT travel_theme_id FROM offer_travel_themes WHERE offer_id = ?', [id]);
  const [dests] = await pool.query('SELECT destination_id FROM offer_destinations WHERE offer_id = ?', [id]);
  const [dates] = await pool.query('SELECT departure_date FROM offer_dates WHERE offer_id = ? ORDER BY departure_date', [id]);
  const [images] = await pool.query('SELECT id, image_url, image_type, alt_text, sort_order FROM offer_images WHERE offer_id = ? ORDER BY sort_order ASC, id ASC', [id]);
  return NextResponse.json({ success: true, data: {
    ...offer,
    typeIds: (types as any[]).map(r => r.travel_type_id),
    themeIds: (themes as any[]).map(r => r.travel_theme_id),
    destinationIds: (dests as any[]).map(r => r.destination_id),
    available_dates: (dates as any[]).map(r => r.departure_date),
    images: images as any[],
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

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      `UPDATE offers SET title=?, slug=?, short_description=?, description=?, is_active=?, price=?, price_currency=?, promotional_price=?, promotional_price_currency=?, promotion_start_date=?, promotion_end_date=?, promotion_description=?, price_includes=?, price_excludes=?, label=?, duration_days=?, duration_nights=? WHERE id=?`,
      [title, slug, summary, description, is_active ? 1 : 0, price, price_currency, promotional_price, promotional_price_currency, promotion_start_date, promotion_end_date, promotion_description, price_includes, price_excludes, label, duration_days, duration_nights, id]
    );

    await conn.query('DELETE FROM offer_travel_types WHERE offer_id = ?', [id]);
    await conn.query('DELETE FROM offer_travel_themes WHERE offer_id = ?', [id]);
    await conn.query('DELETE FROM offer_destinations WHERE offer_id = ?', [id]);
    await conn.query('DELETE FROM offer_dates WHERE offer_id = ?', [id]);
    await conn.query('DELETE FROM offer_images WHERE offer_id = ?', [id]);

    // Save available dates
    if (Array.isArray(available_dates) && available_dates.length > 0) {
      console.log('Sauvegarde des dates:', available_dates);
      const validDates = available_dates.filter(date => date && date.trim());
      
      if (validDates.length > 0) {
        const placeholders = validDates.map(() => '(?, ?)').join(', ');
        const values = validDates.flatMap((date: string) => [id, date]);
        
        await conn.query(
          `INSERT INTO offer_dates (offer_id, departure_date) VALUES ${placeholders}`,
          values
        );
        console.log('Dates sauvegardées:', validDates.length, 'dates pour l\'offre', id);
      }
    }

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

    // Save images
    if (Array.isArray(images) && images.length > 0) {
      const validImages = images.filter(img => img && img.image_url);
      if (validImages.length > 0) {
        const placeholders = validImages.map(() => '(?, ?, ?, ?, ?)').join(', ');
        const values = validImages.flatMap((img: any, index: number) => [
          id,
          img.image_url,
          img.image_type || 'gallery',
          img.alt_text || '',
          img.sort_order !== undefined ? img.sort_order : index
        ]);
        await conn.query(
          `INSERT INTO offer_images (offer_id, image_url, image_type, alt_text, sort_order) VALUES ${placeholders}`,
          values
        );
      }
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
