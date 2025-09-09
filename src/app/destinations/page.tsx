import { generateMetadata as getMetadata } from '@/lib/metadata';
import DestinationsClient from './DestinationsClient';

// Métadonnées SEO pour la page des destinations
export async function generateMetadata() {
  return await getMetadata('page', 'destinations_list');
}

// Server component qui délègue le rendu au client component
export default function DestinationsPage() {
  return <DestinationsClient />;
}

