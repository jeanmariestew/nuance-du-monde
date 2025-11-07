/**
 * Helper functions pour gérer les relations d'images centralisées
 */

import { query, execute } from './db';
import type { ResultSetHeader } from 'mysql2';

export interface Image {
  id: number;
  url: string;
  filename: string;
  title?: string;
  alt_text?: string;
  tags?: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EntityImage {
  id: number;
  image_id: number;
  image_type: string;
  sort_order: number;
  image?: Image;
}

export type EntityType = 
  | 'travel_type'
  | 'travel_theme'
  | 'destination'
  | 'partner'
  | 'testimonial'
  | 'offer';

export type ImageType = 
  | 'main'
  | 'banner'
  | 'gallery'
  | 'avatar'
  | 'background';

/**
 * Récupère ou crée une image depuis une URL
 */
export async function getOrCreateImageByUrl(url: string, metadata?: Partial<Image>): Promise<number | null> {
  if (!url || url.trim() === '') return null;

  try {
    // Chercher l'image existante
    const existing = await query(
      'SELECT id FROM images WHERE url = ? LIMIT 1',
      [url]
    ) as Image[];

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Créer une nouvelle image
    const filename = url.split('/').pop() || 'unknown';
    const result = await execute(
      `INSERT INTO images (url, filename, title, alt_text, tags, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        url,
        filename,
        metadata?.title || filename,
        metadata?.alt_text || '',
        metadata?.tags || '',
        metadata?.uploaded_by || 'system'
      ]
    );

    return (result as ResultSetHeader).insertId;
  } catch (error) {
    console.error('Error in getOrCreateImageByUrl:', error);
    return null;
  }
}

/**
 * Associe une image à une entité
 */
export async function linkImageToEntity(
  entityType: EntityType,
  entityId: number,
  imageId: number,
  imageType: ImageType = 'main',
  sortOrder: number = 0
): Promise<boolean> {
  try {
    const tableName = `${entityType}_images`;
    const entityIdColumn = `${entityType}_id`;

    await execute(
      `INSERT INTO ${tableName} (${entityIdColumn}, image_id, image_type, sort_order)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order)`,
      [entityId, imageId, imageType, sortOrder]
    );

    return true;
  } catch (error) {
    console.error('Error in linkImageToEntity:', error);
    return false;
  }
}

/**
 * Dissocie une image d'une entité
 */
export async function unlinkImageFromEntity(
  entityType: EntityType,
  entityId: number,
  imageId: number,
  imageType?: ImageType
): Promise<boolean> {
  try {
    const tableName = `${entityType}_images`;
    const entityIdColumn = `${entityType}_id`;

    let sql = `DELETE FROM ${tableName} WHERE ${entityIdColumn} = ? AND image_id = ?`;
    const params: (number | string)[] = [entityId, imageId];

    if (imageType) {
      sql += ' AND image_type = ?';
      params.push(imageType);
    }

    await execute(sql, params);
    return true;
  } catch (error) {
    console.error('Error in unlinkImageFromEntity:', error);
    return false;
  }
}

/**
 * Récupère toutes les images d'une entité
 */
export async function getEntityImages(
  entityType: EntityType,
  entityId: number,
  imageType?: ImageType
): Promise<EntityImage[]> {
  try {
    const tableName = `${entityType}_images`;
    const entityIdColumn = `${entityType}_id`;

    let sql = `
      SELECT 
        ei.*,
        i.id as image_id,
        i.url,
        i.filename,
        i.title,
        i.alt_text,
        i.tags,
        i.file_size,
        i.mime_type,
        i.width,
        i.height,
        i.uploaded_by,
        i.created_at as image_created_at,
        i.updated_at as image_updated_at
      FROM ${tableName} ei
      JOIN images i ON ei.image_id = i.id
      WHERE ei.${entityIdColumn} = ?
    `;

    const params: (number | string)[] = [entityId];

    if (imageType) {
      sql += ' AND ei.image_type = ?';
      params.push(imageType);
    }

    sql += ' ORDER BY ei.sort_order ASC, ei.id ASC';

    const rows = await query(sql, params);

    return rows.map((row: any) => ({
      id: row.id,
      image_id: row.image_id,
      image_type: row.image_type,
      sort_order: row.sort_order,
      image: {
        id: row.image_id,
        url: row.url,
        filename: row.filename,
        title: row.title,
        alt_text: row.alt_text,
        tags: row.tags,
        file_size: row.file_size,
        mime_type: row.mime_type,
        width: row.width,
        height: row.height,
        uploaded_by: row.uploaded_by,
        created_at: row.image_created_at,
        updated_at: row.image_updated_at
      }
    }));
  } catch (error) {
    console.error('Error in getEntityImages:', error);
    return [];
  }
}

/**
 * Remplace toutes les images d'une entité pour un type donné
 */
export async function replaceEntityImages(
  entityType: EntityType,
  entityId: number,
  imageUrls: string[],
  imageType: ImageType = 'gallery',
  metadata?: Partial<Image>
): Promise<boolean> {
  try {
    // Supprimer les images existantes de ce type
    const tableName = `${entityType}_images`;
    const entityIdColumn = `${entityType}_id`;

    await execute(
      `DELETE FROM ${tableName} WHERE ${entityIdColumn} = ? AND image_type = ?`,
      [entityId, imageType]
    );

    // Ajouter les nouvelles images
    for (let i = 0; i < imageUrls.length; i++) {
      const imageId = await getOrCreateImageByUrl(imageUrls[i], metadata);
      if (imageId) {
        await linkImageToEntity(entityType, entityId, imageId, imageType, i);
      }
    }

    return true;
  } catch (error) {
    console.error('Error in replaceEntityImages:', error);
    return false;
  }
}

/**
 * Définit l'image principale d'une entité
 */
export async function setMainImage(
  entityType: EntityType,
  entityId: number,
  imageUrl: string,
  metadata?: Partial<Image>
): Promise<boolean> {
  try {
    const imageId = await getOrCreateImageByUrl(imageUrl, metadata);
    if (!imageId) return false;

    // Supprimer l'ancienne image principale
    await unlinkImageFromEntity(entityType, entityId, 0, 'main');

    // Ajouter la nouvelle
    return await linkImageToEntity(entityType, entityId, imageId, 'main', 0);
  } catch (error) {
    console.error('Error in setMainImage:', error);
    return false;
  }
}

/**
 * Récupère l'URL de l'image principale d'une entité
 */
export async function getMainImageUrl(
  entityType: EntityType,
  entityId: number
): Promise<string | null> {
  try {
    const images = await getEntityImages(entityType, entityId, 'main');
    return images.length > 0 && images[0].image ? images[0].image.url : null;
  } catch (error) {
    console.error('Error in getMainImageUrl:', error);
    return null;
  }
}

/**
 * Synchronise les colonnes legacy image_url avec les relations
 */
export async function syncLegacyImageColumns(entityType: EntityType): Promise<void> {
  try {
    const tableName = entityType === 'travel_type' ? 'travel_types' :
                     entityType === 'travel_theme' ? 'travel_themes' :
                     entityType === 'destination' ? 'destinations' :
                     entityType === 'partner' ? 'partners' :
                     entityType === 'testimonial' ? 'testimonials' :
                     'offers';

    const relationTable = `${entityType}_images`;
    const entityIdColumn = `${entityType}_id`;

    // Synchroniser image_url principale
    await execute(`
      UPDATE ${tableName} e
      LEFT JOIN ${relationTable} ei ON e.id = ei.${entityIdColumn} AND ei.image_type = 'main'
      LEFT JOIN images i ON ei.image_id = i.id
      SET e.image_url = i.url
      WHERE ei.id IS NOT NULL
    `);

    // Synchroniser banner_image_url si applicable
    if (['travel_theme', 'destination'].includes(entityType)) {
      await execute(`
        UPDATE ${tableName} e
        LEFT JOIN ${relationTable} ei ON e.id = ei.${entityIdColumn} AND ei.image_type = 'banner'
        LEFT JOIN images i ON ei.image_id = i.id
        SET e.banner_image_url = i.url
        WHERE ei.id IS NOT NULL
      `);
    }

    console.log(`✅ Synchronized legacy columns for ${entityType}`);
  } catch (error) {
    console.error(`Error syncing legacy columns for ${entityType}:`, error);
  }
}

/**
 * Migre une entité depuis image_url vers les relations
 */
export async function migrateEntityToRelations(
  entityType: EntityType,
  entityId: number,
  imageUrl?: string,
  bannerImageUrl?: string
): Promise<boolean> {
  try {
    // Migrer l'image principale
    if (imageUrl) {
      await setMainImage(entityType, entityId, imageUrl);
    }

    // Migrer l'image banner si applicable
    if (bannerImageUrl && ['travel_theme', 'destination'].includes(entityType)) {
      const imageId = await getOrCreateImageByUrl(bannerImageUrl);
      if (imageId) {
        await linkImageToEntity(entityType, entityId, imageId, 'banner', 0);
      }
    }

    return true;
  } catch (error) {
    console.error('Error in migrateEntityToRelations:', error);
    return false;
  }
}

/**
 * Parse les données d'images depuis une vue SQL
 * Format: "id|url|title|alt_text|type;;id|url|title|alt_text|type"
 */
export function parseImagesData(imagesData: string | null): EntityImage[] {
  if (!imagesData) return [];

  try {
    return imagesData.split(';;').map(imageStr => {
      const [id, url, title, alt_text, image_type] = imageStr.split('|');
      return {
        id: parseInt(id),
        image_id: parseInt(id),
        image_type,
        sort_order: 0,
        image: {
          id: parseInt(id),
          url,
          filename: url.split('/').pop() || '',
          title,
          alt_text,
          tags: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    });
  } catch (error) {
    console.error('Error parsing images data:', error);
    return [];
  }
}
