import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  // On va chercher le fichier là où votre script d'upload l'a enregistré
  const { name } = await params;
  const filePath = path.join(process.cwd(), 'public', name);

  try {
    const content = await fs.readFile(filePath);
    
    // On renvoie le contenu avec le bon header pour que le navigateur l'affiche
    return new NextResponse(content, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0' // Empêche le cache pour voir les modifs direct
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Fichier non trouvé" }, { status: 404 });
  }
}
