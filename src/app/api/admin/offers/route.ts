import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

// Fonction pour formater une date ISO en format MySQL YYYY-MM-DD
function formatDateForMySQL(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  try {
    // Si c'est déjà au format YYYY-MM-DD, le retourner tel quel
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    // Sinon, parser et reformater
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

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
    is_pro = 0,
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
    duration_days = null,
    duration_nights = null,
    available_dates = [] as string[],
    dates = [] as { departure_date: string; return_date?: string | null; price?: number | null; price_currency?: string | null }[],
    typeIds = [] as number[],
    themeIds = [] as number[],
    destinationIds = [] as number[],
  } = body || {};

  if (!title || !slug) return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });

  try {
    const res = await execute(
      `INSERT INTO offers (title, slug, short_description, description, is_active, is_pro, price, price_currency, promotional_price, promotional_price_currency, promotion_start_date, promotion_end_date, promotion_description, price_includes, price_excludes, label, programme_link, duration_days, duration_nights)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, summary, description, is_active ? 1 : 0, is_pro ? 1 : 0, price, price_currency, promotional_price, promotional_price_currency, promotion_start_date, promotion_end_date, promotion_description, price_includes, price_excludes, label, programme_link, duration_days, duration_nights]
    );
    const offerId = res.insertId;

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

    // Save date ranges (preferred)
    if (Array.isArray(dates) && dates.length > 0) {
      const valid = dates
        .filter(d => d && d.departure_date)
        .map(d => ({
          ...d,
          departure_date: formatDateForMySQL(d.departure_date),
          return_date: formatDateForMySQL(d.return_date),
        }))
        .filter(d => d.departure_date); // Filtrer les dates invalides
      
      if (valid.length > 0) {
        const placeholders = valid.map(() => '(?, ?, ?, ?, ?)').join(', ');
        const values = valid.flatMap((d) => [
          offerId,
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
      // Backward compatibility: simple departure dates
      const validDates = available_dates
        .map(date => formatDateForMySQL(date))
        .filter((date): date is string => date !== null);
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
        for (let index = 0; index < validImages.length; index++) {
          const img = validImages[index];
          
          // 1. Créer ou récupérer l'image dans la table images
          const [existingImage] = await query(
            'SELECT id FROM images WHERE url = ? LIMIT 1',
            [img.image_url]
          );
          
          let imageId;
          if (existingImage) {
            imageId = (existingImage as any).id;
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
              offerId,
              imageId,
              img.image_type || 'gallery',
              img.alt_text || '',
              img.sort_order !== undefined ? img.sort_order : index
            ]
          );
        }
      }
    }

    return NextResponse.json({ success: true, data: { id: offerId } });
  } catch(e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}
