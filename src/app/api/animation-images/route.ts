import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const animationDir = path.join(process.cwd(), 'public', 'animation');
    
    // Lire tous les fichiers du dossier
    const files = fs.readdirSync(animationDir);
    
    // Filtrer uniquement les images
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    // Créer les URLs complètes
    const imageUrls = imageFiles.map(file => `/animation/${file}`);
    
    return NextResponse.json({ 
      images: imageUrls,
      count: imageUrls.length 
    });
  } catch (error) {
    console.error('Erreur lors de la lecture des images:', error);
    return NextResponse.json({ 
      images: [],
      count: 0,
      error: 'Erreur lors de la lecture des images' 
    }, { status: 500 });
  }
}
