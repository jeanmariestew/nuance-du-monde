import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

// GET - Initialiser la table gallery_images
export async function GET() {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Créer la table si elle n'existe pas
    await query(`
      CREATE TABLE IF NOT EXISTS images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        title VARCHAR(255),
        alt_text VARCHAR(255),
        tags TEXT COMMENT 'Mots-clés séparés par des virgules',
        file_size INT COMMENT 'Taille en bytes',
        mime_type VARCHAR(100),
        width INT,
        height INT,
        uploaded_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tags (tags(255)),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    return NextResponse.json({
      success: true,
      message: 'Table images créée avec succès'
    });
  } catch (error: any) {
    console.error('Gallery init error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
