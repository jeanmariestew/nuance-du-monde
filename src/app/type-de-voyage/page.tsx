import { generateMetadata as getMetadata } from '@/lib/metadata';
import TypeDeVoyageClient from './TypeDeVoyageClient';

// Métadonnées SEO pour la page des types de voyage
export async function generateMetadata() {
  return await getMetadata('page', 'types_list');
}

// Server component qui délègue le rendu au client component
export default function TypeDeVoyagePage() {
  return <TypeDeVoyageClient />;
}
