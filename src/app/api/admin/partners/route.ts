import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  
  try {
    // Create table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS partners (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        agency VARCHAR(191) NOT NULL,
        image_url VARCHAR(1024) NULL,
        sort_order INT UNSIGNED NOT NULL DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY ix_partners_sort_order (sort_order),
        KEY ix_partners_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const rows = await query('SELECT * FROM partners ORDER BY sort_order ASC, created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  
  const body = await req.json();
  const { 
    name, 
    agency, 
    logo_url = null,
    website_url = null,
    sort_order = 0,
    is_active = 1 
  } = body || {};
  
  if (!name || !agency) return NextResponse.json({ success: false, error: 'name et agency requis' }, { status: 400 });
  
  try {
    const res = await execute(
      'INSERT INTO partners (name, agency, logo_url, website_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, agency, logo_url, website_url, sort_order, is_active ? 1 : 0]
    );
    return NextResponse.json({ success: true, id: res.insertId });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}
