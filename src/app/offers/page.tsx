import { generateMetadata as getMetadata } from '@/lib/metadata';
import OffersClient from './OffersClient';

// Métadonnées SEO pour la page des offres
export async function generateMetadata() {
  return await getMetadata('page', 'offers_list');
}

// Server component qui délègue le rendu au client component
export default function OffersListPage() {
  return <OffersClient />;
}
