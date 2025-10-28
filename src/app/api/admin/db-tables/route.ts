import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

// GET - Lister toutes les tables de la base de données
export async function GET() {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tables = await query('SHOW TABLES');
    
    return NextResponse.json({
      success: true,
      data: tables
    });
  } catch (error: any) {
    console.error('DB tables error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
