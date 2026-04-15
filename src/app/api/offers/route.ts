import { NextResponse } from 'next/server';
import {query} from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const destination = url.searchParams.get('destination'); // slug
    const continent = url.searchParams.get('continent'); // continent name
    const type = url.searchParams.get('type'); // slug
    const theme = url.searchParams.get('theme'); // slug
    const hasActiveTheme = url.searchParams.get('hasActiveTheme'); // filter offers with active themes
    const includePro = url.searchParams.get('includePro'); // include pro offers
    const proOnly = url.searchParams.get('proOnly'); // only pro offers

    const parts: string[] = [];
    const params: (string | number)[] = [];

    let sql = `SELECT DISTINCT o.*, 
      (SELECT i.url FROM offer_images oi JOIN images i ON oi.image_id = i.id WHERE oi.offer_id = o.id AND oi.image_type = 'main' ORDER BY oi.sort_order LIMIT 1) as image_main,
      (SELECT i.url FROM offer_images oi JOIN images i ON oi.image_id = i.id WHERE oi.offer_id = o.id AND oi.image_type = 'banner' ORDER BY oi.sort_order LIMIT 1) as image_banner
    FROM offers o`;

    if (destination) {
      sql += `\nJOIN offer_destinations od ON od.offer_id = o.id\nJOIN destinations d ON d.id = od.destination_id`;
      parts.push('d.slug = ?');
      params.push(destination);
    }
    if (continent) {
      if (!destination) {
        sql += `\nJOIN offer_destinations od ON od.offer_id = o.id\nJOIN destinations d ON d.id = od.destination_id`;
      }
      parts.push('d.continent = ?');
      params.push(continent);
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
    
    // Filter offers that have at least one active theme
    if (hasActiveTheme === 'true') {
      sql += `\nJOIN offer_travel_themes oth_active ON oth_active.offer_id = o.id\nJOIN travel_themes th_active ON th_active.id = oth_active.travel_theme_id AND th_active.is_active = 1`;
    }

    sql += `\nWHERE o.is_active = 1`;
    
    // Filter Pro offers based on travel_types.is_pro
    if (proOnly === 'true') {
      // Only offers that have at least one Pro travel type
      sql += ` AND EXISTS (
        SELECT 1 FROM offer_travel_types ott_pro 
        JOIN travel_types tt_pro ON tt_pro.id = ott_pro.travel_type_id 
        WHERE ott_pro.offer_id = o.id AND tt_pro.is_pro = 1
      )`;
    } else if (includePro !== 'true') {
      // Exclude offers that have ONLY Pro travel types (keep offers with at least one non-Pro type)
      sql += ` AND EXISTS (
        SELECT 1 FROM offer_travel_types ott_non_pro 
        JOIN travel_types tt_non_pro ON tt_non_pro.id = ott_non_pro.travel_type_id 
        WHERE ott_non_pro.offer_id = o.id AND (tt_non_pro.is_pro = 0 OR tt_non_pro.is_pro IS NULL)
      )`;
    }
    
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
    
    // Fetch available dates, images and themes for all offers
    const offerIds = (rows as OfferRow[]).map(o => o.id);
    let availableDatesMap: Record<number, string[]> = {};
    let minPriceMap: Record<number, number | null> = {};
    let imagesMap: Record<number, any[]> = {};
    let themesMap: Record<number, any[]> = {};
    let destinationsMap: Record<number, any[]> = {};
    
    if (offerIds.length > 0) {
      const datesRows = await query(
        `SELECT offer_id, departure_date, price FROM offer_dates WHERE offer_id IN (${offerIds.map(() => '?').join(',')}) ORDER BY departure_date`,
        offerIds
      );
      availableDatesMap = (datesRows as any[]).reduce((acc, row) => {
        if (!acc[row.offer_id]) acc[row.offer_id] = [];
        acc[row.offer_id].push(row.departure_date);
        return acc;
      }, {} as Record<number, string[]>);
      minPriceMap = (datesRows as any[]).reduce((acc, row) => {
        const p = row.price;
        if (p !== null && p !== undefined) {
          if (acc[row.offer_id] === undefined || p < acc[row.offer_id]) acc[row.offer_id] = p;
        } else if (acc[row.offer_id] === undefined) {
          acc[row.offer_id] = null;
        }
        return acc;
      }, {} as Record<number, number | null>);
      
      // Fetch all images for offers
      const imagesRows = await query(
        `SELECT oi.offer_id, i.url as image_url, oi.image_type, oi.alt_text, oi.sort_order 
         FROM offer_images oi
         JOIN images i ON oi.image_id = i.id
         WHERE oi.offer_id IN (${offerIds.map(() => '?').join(',')}) 
         ORDER BY oi.sort_order, oi.id`,
        offerIds
      );
      imagesMap = (imagesRows as any[]).reduce((acc, row) => {
        if (!acc[row.offer_id]) acc[row.offer_id] = [];
        acc[row.offer_id].push(row);
        return acc;
      }, {} as Record<number, any[]>);
      
      // Fetch themes for offers
      const themesRows = await query(
        `SELECT oth.offer_id, th.id, th.title, th.slug, th.is_active
         FROM offer_travel_themes oth
         JOIN travel_themes th ON th.id = oth.travel_theme_id
         WHERE oth.offer_id IN (${offerIds.map(() => '?').join(',')})`,
        offerIds
      );
      themesMap = (themesRows as any[]).reduce((acc, row) => {
        if (!acc[row.offer_id]) acc[row.offer_id] = [];
        acc[row.offer_id].push({
          id: row.id,
          title: row.title,
          slug: row.slug,
          is_active: row.is_active
        });
        return acc;
      }, {} as Record<number, any[]>);

      // Fetch destinations for offers
      const destinationsRows = await query(
        `SELECT od.offer_id, d.id, d.title, d.slug, d.continent
         FROM offer_destinations od
         JOIN destinations d ON d.id = od.destination_id
         WHERE od.offer_id IN (${offerIds.map(() => '?').join(',')})`,
        offerIds
      );
      destinationsMap = (destinationsRows as any[]).reduce((acc, row) => {
        if (!acc[row.offer_id]) acc[row.offer_id] = [];
        acc[row.offer_id].push({
          id: row.id,
          title: row.title,
          slug: row.slug,
          continent: row.continent
        });
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
        price_from: (minPriceMap[o.id] ?? null) ?? o.price_from ?? o.price ?? null,
        available_dates: availableDatesMap[o.id] || [],
        images: offerImages,
        themes: themesMap[o.id] || [],
        destinations: destinationsMap[o.id] || [],
      };
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur liste offres:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
