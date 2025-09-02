import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Create table if it doesn't exist
    await pool.query(`
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

    // Check if we have any partners, if not, insert initial data
    const [countResult] = await pool.query('SELECT COUNT(*) as count FROM partners');
    const count = (countResult as any[])[0].count;
    
    if (count === 0) {
      await pool.query(`
        INSERT INTO partners (name, agency, logo_url, sort_order, is_active) VALUES
        ('Caroline Racine', 'Voyage Vasco Beauport', '/images/caroline-racine.jpg', 1, 1),
        ('Cathérine', 'Voyages Eclipse', NULL, 2, 1),
        ('Lyne', 'Voyages Prestige', NULL, 3, 1),
        ('Sonia Gioffre', 'Voyages Reid', NULL, 4, 1)
      `);
    }

    const [rows] = await pool.query('SELECT id, name, agency, logo_url as image_url, website_url, sort_order, is_active, created_at, updated_at FROM partners WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
