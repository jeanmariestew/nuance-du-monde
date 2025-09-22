import { NextResponse } from 'next/server';
import { hasValidAdminToken } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST() {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Vérifier si la colonne continent existe déjà
    const checkColumnQuery = `
      SELECT COUNT(*) as column_exists 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'destinations' 
        AND COLUMN_NAME = 'continent' 
        AND TABLE_SCHEMA = DATABASE()
    `;
    
    const checkResult = await query(checkColumnQuery);
    const columnExists = (checkResult as any)[0]?.column_exists > 0;
    
    if (columnExists) {
      return NextResponse.json({ 
        success: true, 
        message: 'La colonne continent existe déjà dans la table destinations' 
      });
    }
    
    // Ajouter la colonne continent
    await query('ALTER TABLE destinations ADD COLUMN continent VARCHAR(100) NULL AFTER slug');
    
    // Ajouter un index sur la colonne continent pour optimiser les requêtes
    await query('CREATE INDEX idx_destinations_continent ON destinations(continent)');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Migration réussie : colonne continent ajoutée à la table destinations avec index' 
    });
  } catch (err: any) {
    console.error('Migration error:', err);
    return NextResponse.json({ 
      success: false, 
      error: `Migration failed: ${err.message}` 
    }, { status: 500 });
  }
}
