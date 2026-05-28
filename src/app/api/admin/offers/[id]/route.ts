import { NextResponse } from 'next/server';
import {query, execute} from '@/lib/db';
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
    is_pro: row.is_pro || false,
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
  
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ success: false, error: 'JSON invalide dans le corps de la requête', details: 'parse_error' }, { status: 400 });
  }

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

  if (!title || !slug) {
    return NextResponse.json({ success: false, error: 'Le titre et le slug sont requis', details: 'validation_error' }, { status: 400 });
  }

  const errors: string[] = [];
  console.log('[PUT /offers] Mise à jour offre ID:', id, 'title:', title);

  // 1. Mise à jour des données principales de l'offre
  try {
    const coordinatesJson = Array.isArray(coordinates) && coordinates.length > 0 
      ? JSON.stringify(coordinates) 
      : null;
    const mapCenterJson = map_center && map_center.lat && map_center.lng
      ? JSON.stringify(map_center)
      : null;

    await query(
      `UPDATE offers SET title=?, slug=?, short_description=?, description=?, is_active=?, is_pro=?, price=?, price_currency=?, promotional_price=?, promotional_price_currency=?, promotion_start_date=?, promotion_end_date=?, promotion_description=?, price_includes=?, price_excludes=?, label=?, programme_link=?, coordinates=?, map_center=?, map_image=?, duration_days=?, duration_nights=? WHERE id=?`,
      [title, slug, summary, description, is_active ? 1 : 0, is_pro ? 1 : 0, price, price_currency, promotional_price, promotional_price_currency, promotion_start_date, promotion_end_date, promotion_description, price_includes, price_excludes, label, programme_link, coordinatesJson, mapCenterJson, map_image, duration_days, duration_nights, id]
    );
  } catch (e) {
    console.error('[PUT /offers] Erreur UPDATE offers:', e);
    return NextResponse.json({ 
      success: false, 
      error: `Erreur lors de la mise à jour des données principales: ${e instanceof Error ? e.message : 'Erreur inconnue'}`,
      details: 'update_offer_error'
    }, { status: 500 });
  }

  // 2. Mise à jour des types de voyage (upsert)
  try {
    const existingTypes = await query('SELECT travel_type_id FROM offer_travel_types WHERE offer_id = ?', [id]) as any[];
    const existingTypeIds = existingTypes.map(r => r.travel_type_id);
    const newTypeIds = Array.isArray(typeIds) ? typeIds : [];
    
    // Supprimer les types qui ne sont plus sélectionnés
    const typesToRemove = existingTypeIds.filter(tid => !newTypeIds.includes(tid));
    if (typesToRemove.length > 0) {
      await query(
        `DELETE FROM offer_travel_types WHERE offer_id = ? AND travel_type_id IN (${typesToRemove.map(() => '?').join(',')})`,
        [id, ...typesToRemove]
      );
    }
    
    // Ajouter les nouveaux types
    const typesToAdd = newTypeIds.filter(tid => !existingTypeIds.includes(tid));
    if (typesToAdd.length > 0) {
      await query(
        `INSERT IGNORE INTO offer_travel_types (offer_id, travel_type_id) VALUES ${typesToAdd.map(() => '(?, ?)').join(', ')}`,
        typesToAdd.flatMap((tid: number) => [id, tid])
      );
    }
  } catch (e) {
    console.error('[PUT /offers] Erreur types de voyage:', e);
    errors.push(`Types de voyage: ${e instanceof Error ? e.message : 'Erreur inconnue'}`);
  }

  // 3. Mise à jour des thèmes (upsert)
  try {
    const existingThemes = await query('SELECT travel_theme_id FROM offer_travel_themes WHERE offer_id = ?', [id]) as any[];
    const existingThemeIds = existingThemes.map(r => r.travel_theme_id);
    const newThemeIds = Array.isArray(themeIds) ? themeIds : [];
    
    const themesToRemove = existingThemeIds.filter(tid => !newThemeIds.includes(tid));
    if (themesToRemove.length > 0) {
      await query(
        `DELETE FROM offer_travel_themes WHERE offer_id = ? AND travel_theme_id IN (${themesToRemove.map(() => '?').join(',')})`,
        [id, ...themesToRemove]
      );
    }
    
    const themesToAdd = newThemeIds.filter(tid => !existingThemeIds.includes(tid));
    if (themesToAdd.length > 0) {
      await query(
        `INSERT IGNORE INTO offer_travel_themes (offer_id, travel_theme_id) VALUES ${themesToAdd.map(() => '(?, ?)').join(', ')}`,
        themesToAdd.flatMap((tid: number) => [id, tid])
      );
    }
  } catch (e) {
    console.error('[PUT /offers] Erreur thèmes:', e);
    errors.push(`Thèmes: ${e instanceof Error ? e.message : 'Erreur inconnue'}`);
  }

  // 4. Mise à jour des destinations (upsert)
  try {
    const existingDests = await query('SELECT destination_id FROM offer_destinations WHERE offer_id = ?', [id]) as any[];
    const existingDestIds = existingDests.map(r => r.destination_id);
    const newDestIds = Array.isArray(destinationIds) ? destinationIds : [];
    
    const destsToRemove = existingDestIds.filter(did => !newDestIds.includes(did));
    if (destsToRemove.length > 0) {
      await query(
        `DELETE FROM offer_destinations WHERE offer_id = ? AND destination_id IN (${destsToRemove.map(() => '?').join(',')})`,
        [id, ...destsToRemove]
      );
    }
    
    const destsToAdd = newDestIds.filter(did => !existingDestIds.includes(did));
    if (destsToAdd.length > 0) {
      await query(
        `INSERT IGNORE INTO offer_destinations (offer_id, destination_id) VALUES ${destsToAdd.map(() => '(?, ?)').join(', ')}`,
        destsToAdd.flatMap((did: number) => [id, did])
      );
    }
  } catch (e) {
    console.error('[PUT /offers] Erreur destinations:', e);
    errors.push(`Destinations: ${e instanceof Error ? e.message : 'Erreur inconnue'}`);
  }

  // 5. Mise à jour des dates (upsert avec ID)
  try {
    const existingDates = await query('SELECT id FROM offer_dates WHERE offer_id = ?', [id]) as any[];
    const existingDateIds = existingDates.map(r => r.id);
    
    // Dates à traiter
    const datesToProcess = Array.isArray(dates) && dates.length > 0 
      ? dates.filter(d => d && d.departure_date)
      : (Array.isArray(available_dates) && available_dates.length > 0 
        ? available_dates.filter(d => d && d.trim()).map(d => ({ departure_date: d }))
        : []);
    
    const processedIds: number[] = [];
    
    for (const d of datesToProcess) {
      const dateData = d as { id?: number; departure_date: string; return_date?: string | null; price?: number | null; price_currency?: string | null };
      
      // Formater les dates pour MySQL
      const formattedDepartureDate = formatDateForMySQL(dateData.departure_date);
      const formattedReturnDate = formatDateForMySQL(dateData.return_date);
      
      if (!formattedDepartureDate) {
        console.warn('[PUT /offers] Date de départ invalide ignorée:', dateData.departure_date);
        continue;
      }
      
      if (dateData.id && existingDateIds.includes(dateData.id)) {
        // Mise à jour d'une date existante
        await query(
          `UPDATE offer_dates SET departure_date=?, return_date=?, price=?, price_currency=? WHERE id=? AND offer_id=?`,
          [formattedDepartureDate, formattedReturnDate, dateData.price ?? null, dateData.price_currency || 'EUR', dateData.id, id]
        );
        processedIds.push(dateData.id);
      } else {
        // Nouvelle date
        const result = await execute(
          `INSERT INTO offer_dates (offer_id, departure_date, return_date, price, price_currency) VALUES (?, ?, ?, ?, ?)`,
          [id, formattedDepartureDate, formattedReturnDate, dateData.price ?? null, dateData.price_currency || 'EUR']
        );
        processedIds.push(result.insertId);
      }
    }
    
    // Supprimer les dates qui ne sont plus présentes
    const datesToRemove = existingDateIds.filter(did => !processedIds.includes(did));
    if (datesToRemove.length > 0) {
      await query(
        `DELETE FROM offer_dates WHERE offer_id = ? AND id IN (${datesToRemove.map(() => '?').join(',')})`,
        [id, ...datesToRemove]
      );
    }
  } catch (e) {
    console.error('[PUT /offers] Erreur dates:', e);
    errors.push(`Dates: ${e instanceof Error ? e.message : 'Erreur inconnue'}`);
  }

  // 6. Mise à jour des images (upsert)
  try {
    const existingImages = await query('SELECT id, image_id FROM offer_images WHERE offer_id = ?', [id]) as any[];
    const existingImageRelIds = existingImages.map(r => r.id);
    
    const validImages = Array.isArray(images) ? images.filter(img => img && img.image_url) : [];
    const processedRelIds: number[] = [];
    
    for (let index = 0; index < validImages.length; index++) {
      const img = validImages[index];
      
      // Récupérer ou créer l'image dans la table images
      let imageId: number;
      const existingImg = await query('SELECT id FROM images WHERE url = ? LIMIT 1', [img.image_url]) as any[];
      
      if (existingImg.length > 0) {
        imageId = existingImg[0].id;
      } else {
        const filename = img.image_url.split('/').pop() || 'unknown';
        const result = await execute(
          `INSERT INTO images (url, filename, title, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?)`,
          [img.image_url, filename, img.alt_text || filename, img.alt_text || '', 'admin']
        );
        imageId = result.insertId;
      }
      
      // Vérifier si la relation existe déjà
      const existingRel = existingImages.find(r => r.image_id === imageId);
      
      if (existingRel) {
        // Mise à jour de la relation existante
        await query(
          `UPDATE offer_images SET image_type=?, alt_text=?, sort_order=? WHERE id=?`,
          [img.image_type || 'gallery', img.alt_text || '', img.sort_order !== undefined ? img.sort_order : index, existingRel.id]
        );
        processedRelIds.push(existingRel.id);
      } else {
        // Nouvelle relation
        const result = await execute(
          `INSERT INTO offer_images (offer_id, image_id, image_type, alt_text, sort_order) VALUES (?, ?, ?, ?, ?)`,
          [id, imageId, img.image_type || 'gallery', img.alt_text || '', img.sort_order !== undefined ? img.sort_order : index]
        );
        processedRelIds.push(result.insertId);
      }
    }
    
    // Supprimer les relations d'images qui ne sont plus présentes
    const relsToRemove = existingImageRelIds.filter(rid => !processedRelIds.includes(rid));
    if (relsToRemove.length > 0) {
      await query(
        `DELETE FROM offer_images WHERE offer_id = ? AND id IN (${relsToRemove.map(() => '?').join(',')})`,
        [id, ...relsToRemove]
      );
    }
  } catch (e) {
    console.error('[PUT /offers] Erreur images:', e);
    errors.push(`Images: ${e instanceof Error ? e.message : 'Erreur inconnue'}`);
  }

  // Retourner le résultat avec les erreurs partielles si présentes
  if (errors.length > 0) {
    return NextResponse.json({ 
      success: false, 
      partial: true,
      error: `Certaines données n'ont pas pu être sauvegardées`,
      details: errors,
      message: 'Les données principales ont été sauvegardées mais certaines relations ont échoué'
    }, { status: 207 }); // 207 Multi-Status
  }

  return NextResponse.json({ success: true, message: 'Offre mise à jour avec succès' });
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
