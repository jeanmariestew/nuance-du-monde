import { query } from '@/lib/db';
import { SeoMetadata } from '@/types';

interface DbRow {
  [key: string]: unknown;
}

// Helper function to safely convert unknown to string
function toString(value: unknown): string {
  return String(value || '');
}

// Helper function to safely convert unknown to optional string
function toOptionalString(value: unknown): string | undefined {
  return value ? String(value) : undefined;
}

// Service pour récupérer les métadonnées SEO
export class MetadataService {
  // Récupérer les métadonnées d'une page statique ou d'une entité spécifique
  static async getPageMetadata(pageType: string, pageSlug?: string): Promise<SeoMetadata | null> {
    try {
      let sql = 'SELECT * FROM page_metadata WHERE page_type = ? AND is_active = 1';
      const params: unknown[] = [pageType];

      if (pageSlug) {
        sql += ' AND page_slug = ?';
        params.push(pageSlug);
      } 

      console.log('sql',sql,'pageType',pageType, params)

      const results = await query(sql, params) as DbRow[];
      
      if (!results || results.length === 0) {
        // Si pas de métadonnées spécifiques trouvées, essayer de récupérer depuis les entités
        if (pageSlug) {
          switch (pageType) {
            case 'destination':
              return await this.getDestinationMetadata(pageSlug);
            case 'offer':
              return await this.getOfferMetadata(pageSlug);
            case 'theme':
              return await this.getThemeMetadata(pageSlug);
            case 'travel-type':
              return await this.getTravelTypeMetadata(pageSlug);
          }
        }
        return null;
      }

      const metadata = results[0];
      return this.formatMetadata(metadata);
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées de page:', error);
      return null;
    }
  }

  // Récupérer les métadonnées d'une destination
  static async getDestinationMetadata(slug: string): Promise<SeoMetadata | null> {
    try {
      const results = await query(
        'SELECT meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url FROM page_metadata WHERE page_type = ? AND page_slug = ? AND is_active = 1',
        ['destination', slug]
      ) as DbRow[];
      if (!results || results.length === 0) {
        return null;
      }

      const destination = results[0];
      const title = toString(destination.title);
      return {
        title: toString(destination.meta_title) || `${title} - Nuance du monde`,
        description: toString(destination.meta_description) || `Découvrez ${title} avec Nuance du monde. Voyage sur mesure avec des expériences authentiques.`,
        keywords: toOptionalString(destination.meta_keywords),
        ogTitle: toString(destination.og_title) || toString(destination.meta_title) || title,
        ogDescription: toOptionalString(destination.og_description) || toOptionalString(destination.meta_description),
        ogImage: toOptionalString(destination.og_image),
        canonicalUrl: toOptionalString(destination.canonical_url)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées de destination:', error);
      return null;
    }
  }

  // Récupérer les métadonnées d'une offre
  static async getOfferMetadata(slug: string): Promise<SeoMetadata | null> {
    try {
      const results = await query(
        'SELECT meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url FROM page_metadata WHERE page_type = ? AND page_slug = ? AND is_active = 1',
        ['offer', slug]
      ) as DbRow[];

      if (!results || results.length === 0) {
        return null;
      }

      const offer = results[0];
      const title = toString(offer.title);
      return {
        title: toString(offer.meta_title) || `${title} - Nuance du monde`,
        description: toString(offer.meta_description) || `Découvrez notre offre ${title}. Voyage sur mesure au meilleur prix.`,
        keywords: toOptionalString(offer.meta_keywords),
        ogTitle: toString(offer.og_title) || toString(offer.meta_title) || title,
        ogDescription: toOptionalString(offer.og_description) || toOptionalString(offer.meta_description),
        ogImage: toOptionalString(offer.og_image),
        canonicalUrl: toOptionalString(offer.canonical_url)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées d\'offre:', error);
      return null;
    }
  }

  // Récupérer les métadonnées d'un thème
  static async getThemeMetadata(slug: string): Promise<SeoMetadata | null> {
    try {
      const results = await query(
        'SELECT meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url FROM page_metadata WHERE page_type = ? AND page_slug = ? AND is_active = 1',
        ['theme', slug]
      ) as DbRow[];

      if (!results || results.length === 0) {
        return null;
      }

      const theme = results[0];
      const title = toString(theme.title);
      return {
        title: toString(theme.meta_title) || `${title} - Nuance du monde`,
        description: toString(theme.meta_description) || `Explorez nos voyages sur le thème ${title}. Expériences uniques et authentiques.`,
        keywords: toOptionalString(theme.meta_keywords),
        ogTitle: toString(theme.og_title) || toString(theme.meta_title) || title,
        ogDescription: toOptionalString(theme.og_description) || toOptionalString(theme.meta_description),
        ogImage: toOptionalString(theme.og_image),
        canonicalUrl: toOptionalString(theme.canonical_url)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées de thème:', error);
      return null;
    }
  }

  // Récupérer les métadonnées d'un type de voyage
  static async getTravelTypeMetadata(slug: string): Promise<SeoMetadata | null> {
    try {
      const results = await query(
        'SELECT meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url FROM page_metadata WHERE page_type = ? AND page_slug = ? AND is_active = 1',
        ['travel-type', slug]
      ) as DbRow[];

      if (!results || results.length === 0) {
        return null;
      }

      const travelType = results[0];
      const title = toString(travelType.title);
      return {
        title: toString(travelType.meta_title) || `${title} - Nuance du monde`,
        description: toString(travelType.meta_description) || `Découvrez nos voyages de type ${title}. Voyage sur mesure adapté à vos envies.`,
        keywords: toOptionalString(travelType.meta_keywords),
        ogTitle: toString(travelType.og_title) || toString(travelType.meta_title) || title,
        ogDescription: toOptionalString(travelType.og_description) || toOptionalString(travelType.meta_description),
        ogImage: toOptionalString(travelType.og_image),
        canonicalUrl: toOptionalString(travelType.canonical_url)
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées de type de voyage:', error);
      return null;
    }
  }

  // Métadonnées par défaut
  static getDefaultMetadata(): SeoMetadata {
    return {
      title: 'Nuance du monde votre spécialiste du voyage sur mesure',
      description: 'Créez avec nous votre voyage sur mesure, partout dans le monde. Nous vous faisons vivre des expériences authentiques et confortables, et ce, au meilleur prix du marché.',
      keywords: 'voyage sur mesure, agence de voyage, destinations, circuits, voyages en groupe, voyages individuels',
      ogTitle: 'Nuance du monde - Voyages sur mesure',
      ogDescription: 'Créez avec nous votre voyage sur mesure, partout dans le monde. Expériences authentiques au meilleur prix.',
      ogType: 'website',
      twitterCard: 'summary_large_image'
    };
  }

  // Formater les métadonnées depuis la base de données
  private static formatMetadata(metadata: DbRow): SeoMetadata {
    return {
      title: toString(metadata.meta_title),
      description: toString(metadata.meta_description),
      keywords: toOptionalString(metadata.meta_keywords),
      ogTitle: toOptionalString(metadata.og_title),
      ogDescription: toOptionalString(metadata.og_description),
      ogImage: toOptionalString(metadata.og_image),
      ogType: toOptionalString(metadata.og_type),
      twitterCard: toOptionalString(metadata.twitter_card),
      twitterTitle: toOptionalString(metadata.twitter_title),
      twitterDescription: toOptionalString(metadata.twitter_description),
      twitterImage: toOptionalString(metadata.twitter_image),
      canonicalUrl: toOptionalString(metadata.canonical_url),
      robots: toOptionalString(metadata.robots)
    };
  }
}

// Hook pour générer les métadonnées Next.js
export async function generateMetadata(
  type: 'page' | 'destination' | 'offer' | 'theme' | 'travel-type',
  identifier: string,
  pageSlug?: string
) {
  let metadata: SeoMetadata | null = null;

  switch (type) {
    case 'page':
      metadata = await MetadataService.getPageMetadata(identifier, pageSlug);
      break;
    case 'destination':
      metadata = await MetadataService.getDestinationMetadata(identifier);
      break;
    case 'offer':
      metadata = await MetadataService.getOfferMetadata(identifier);
      break;
    case 'theme':
      metadata = await MetadataService.getThemeMetadata(identifier);
      break;
    case 'travel-type':
      metadata = await MetadataService.getTravelTypeMetadata(identifier);
      break;
  }

  if (!metadata) {
    metadata = MetadataService.getDefaultMetadata();
  }

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.ogTitle || metadata.title,
      description: metadata.ogDescription || metadata.description,
      images: metadata.ogImage ? [{ url: metadata.ogImage }] : undefined,
      type: metadata.ogType || 'website',
    },
    twitter: {
      card: metadata.twitterCard || 'summary_large_image',
      title: metadata.twitterTitle || metadata.ogTitle || metadata.title,
      description: metadata.twitterDescription || metadata.ogDescription || metadata.description,
      images: metadata.twitterImage ? [metadata.twitterImage] : metadata.ogImage ? [metadata.ogImage] : undefined,
    },
    alternates: {
      canonical: metadata.canonicalUrl
    },
    robots: metadata.robots || 'index,follow'
  };
}
