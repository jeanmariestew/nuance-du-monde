import { NextResponse } from 'next/server';
import {query, execute} from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
  const offers = await query('SELECT * FROM offers WHERE id = ?', [id]);
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
    programme_link: row.programme_link,
    coordinates: row.coordinates ? (typeof row.coordinates === 'string' ? JSON.parse(row.coordinates) : row.coordinates) : [],
    map_center: row.map_center ? (typeof row.map_center === 'string' ? JSON.parse(row.map_center) : row.map_center) : null,
    map_image: row.map_image || null,
    duration_days: row.duration_days,
    duration_nights: row.duration_nights,
  } as any;
  const types = await query('SELECT travel_type_id FROM offer_travel_types WHERE offer_id = ?', [id]);
  const themes = await query('SELECT travel_theme_id FROM offer_travel_themes WHERE offer_id = ?', [id]);
  const dests = await query('SELECT destination_id FROM offer_destinations WHERE offer_id = ?', [id]);
  const datesRows = await query('SELECT id, departure_date, return_date, price, price_currency FROM offer_dates WHERE offer_id = ? ORDER BY departure_date', [id]);
  const images = await query(`
    SELECT oi.id, i.url as image_url, oi.image_type, oi.alt_text, oi.sort_order 
    FROM offer_images oi
    JOIN images i ON oi.image_id = i.id
    WHERE oi.offer_id = ? 
    ORDER BY oi.sort_order ASC, oi.id ASC
  `, [id]);
  return NextResponse.json({ success: true, data: {
    ...offer,
    typeIds: (types as any[]).map(r => r.travel_type_id),
    themeIds: (themes as any[]).map(r => r.travel_theme_id),
    destinationIds: (dests as any[]).map(r => r.destination_id),
    available_dates: (datesRows as any[]).map(r => r.departure_date),
    dates: datesRows as any[],
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
    programme_link = null,
    coordinates = [] as Array<{ name: string; lat: number; lng: number }>,
    map_center = null as { lat: number; lng: number; zoom: number } | null,
    map_image = null as string | null,
    duration_days = null,
    duration_nights = null,
    available_dates = [] as string[],
    dates = [] as { id?: number; departure_date: string; return_date?: string | null; price?: number | null; price_currency?: string | null }[],
    typeIds = [] as number[],
    themeIds = [] as number[],
    destinationIds = [] as number[],
  } = body || {};
  if (!title || !slug) return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });

  try {
    // Serialize coordinates and map_center to JSON string
    const coordinatesJson = Array.isArray(coordinates) && coordinates.length > 0 
      ? JSON.stringify(coordinates) 
      : null;
    const mapCenterJson = map_center && map_center.lat && map_center.lng
      ? JSON.stringify(map_center)
      : null;

    await query(
      `UPDATE offers SET title=?, slug=?, short_description=?, description=?, is_active=?, price=?, price_currency=?, promotional_price=?, promotional_price_currency=?, promotion_start_date=?, promotion_end_date=?, promotion_description=?, price_includes=?, price_excludes=?, label=?, programme_link=?, coordinates=?, map_center=?, map_image=?, duration_days=?, duration_nights=? WHERE id=?`,
      [title, slug, summary, description, is_active ? 1 : 0, price, price_currency, promotional_price, promotional_price_currency, promotion_start_date, promotion_end_date, promotion_description, price_includes, price_excludes, label, programme_link, coordinatesJson, mapCenterJson, map_image, duration_days, duration_nights, id]
    );

    await query('DELETE FROM offer_travel_types WHERE offer_id = ?', [id]);
    await query('DELETE FROM offer_travel_themes WHERE offer_id = ?', [id]);
    await query('DELETE FROM offer_destinations WHERE offer_id = ?', [id]);
    await query('DELETE FROM offer_dates WHERE offer_id = ?', [id]);
    await query('DELETE FROM offer_images WHERE offer_id = ?', [id]);

    // Save date ranges (preferred). Fallback to available_dates.
    if (Array.isArray(dates) && dates.length > 0) {
      const valid = dates.filter(d => d && d.departure_date);
      if (valid.length > 0) {
        const placeholders = valid.map(() => '(?, ?, ?, ?, ?)').join(', ');
        const values = valid.flatMap((d) => [
          id,
          d.departure_date,
          d.return_date || null,
          d.price ?? null,
          (d.price_currency || 'EUR'),
        ]);
        await query(
          `INSERT INTO offer_dates (offer_id, departure_date, return_date, price, price_currency) VALUES ${placeholders}`,
          values
        );
      }
    } else if (Array.isArray(available_dates) && available_dates.length > 0) {
      const validDates = available_dates.filter(date => date && date.trim());
      if (validDates.length > 0) {
        const placeholders = validDates.map(() => '(?, ?)').join(', ');
        const values = validDates.flatMap((date: string) => [id, date]);
        await query(
          `INSERT INTO offer_dates (offer_id, departure_date) VALUES ${placeholders}`,
          values
        );
      }
    }

    if (Array.isArray(typeIds) && typeIds.length) {
      await query(
        `INSERT IGNORE INTO offer_travel_types (offer_id, travel_type_id)
         VALUES ${typeIds.map(() => '(?, ?)').join(', ')}`,
        typeIds.flatMap((tid: number) => [id, tid])
      );
    }
    if (Array.isArray(themeIds) && themeIds.length) {
      await query(
        `INSERT IGNORE INTO offer_travel_themes (offer_id, travel_theme_id)
         VALUES ${themeIds.map(() => '(?, ?)').join(', ')}`,
        themeIds.flatMap((tid: number) => [id, tid])
      );
    }
    if (Array.isArray(destinationIds) && destinationIds.length) {
      await query(
        `INSERT IGNORE INTO offer_destinations (offer_id, destination_id)
         VALUES ${destinationIds.map(() => '(?, ?)').join(', ')}`,
        destinationIds.flatMap((did: number) => [id, did])
      );
    }

    // Save images
    if (Array.isArray(images) && images.length > 0) {
      const validImages = images.filter(img => img && img.image_url);
      if (validImages.length > 0) {
        for (let index = 0; index < validImages.length; index++) {
          const img = validImages[index];
          
          // 1. Créer ou récupérer l'image dans la table images
          const existingImages = await query(
            'SELECT id FROM images WHERE url = ? LIMIT 1',
            [img.image_url]
          );
          
          let imageId;
          if (existingImages.length > 0) {
            imageId = (existingImages[0] as any).id;
          } else {
            // Créer une nouvelle image
            const filename = img.image_url.split('/').pop() || 'unknown';
            const result = await execute(
              `INSERT INTO images (url, filename, title, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?)`,
              [img.image_url, filename, img.alt_text || filename, img.alt_text || '', 'admin']
            );
            imageId = result.insertId;
          }
          
          // 2. Créer la relation dans offer_images
          await execute(
            `INSERT INTO offer_images (offer_id, image_id, image_type, alt_text, sort_order) VALUES (?, ?, ?, ?, ?)`,
            [
              id,
              imageId,
              img.image_type || 'gallery',
              img.alt_text || '',
              img.sort_order !== undefined ? img.sort_order : index
            ]
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  } 
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
  try {
    await query('DELETE FROM offer_travel_types WHERE offer_id = ?', [id]);
    await query('DELETE FROM offer_travel_themes WHERE offer_id = ?', [id]);
    await query('DELETE FROM offer_destinations WHERE offer_id = ?', [id]);
    await query('DELETE FROM offer_dates WHERE offer_id = ?', [id]);
    await query('DELETE FROM offers WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  } 
}
