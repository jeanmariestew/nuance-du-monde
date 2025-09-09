import { generateMetadata as getMetadata } from '@/lib/metadata';
import ThemesClient from './ThemesClient';

// Métadonnées SEO pour la page des thèmes
export async function generateMetadata() {
  return await getMetadata('page', 'themes_list');
}

// Server component qui délègue le rendu au client component
export default function ThemesPage() {
  return <ThemesClient />;
}
