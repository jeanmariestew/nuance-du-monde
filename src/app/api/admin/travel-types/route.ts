import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic'; // Prevent static optimization

export async function GET() {
  let connection;
  try {
    if (!(await hasValidAdminToken())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM travel_types ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' }, 
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(req: Request) {
  let connection;
  try {
    if (!(await hasValidAdminToken())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { 
      title, 
      slug, 
      description = '', 
      short_description = '', 
      image_url = '', 
      sort_order = 0,
      is_active = 1 
    } = body || {};
    
    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });
    }
    
    connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO travel_types 
       (title, slug, description, short_description, image_url, sort_order, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [
        title, 
        slug, 
        description, 
        short_description, 
        image_url, 
        sort_order, 
        is_active ? 1 : 0
      ]
    );
    
    return NextResponse.json({ success: true, data: { id: (result as any).insertId } });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database error' }, 
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
