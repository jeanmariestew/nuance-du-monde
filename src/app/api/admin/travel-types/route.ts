import {  NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic'; // Prevent static optimization

export async function GET() {
  try {
    if (!(await hasValidAdminToken())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const rows = await query('SELECT * FROM travel_types ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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
      is_active = 1,
      meta_title = '',
      meta_description = '',
      meta_keywords = '',
      og_title = '',
      og_description = '',
      og_image = '',
      canonical_url = ''
    } = body || {};
    
    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });
    }
    
    const result = await execute(
      'INSERT INTO travel_types (title, slug, description, short_description, image_url, sort_order, is_active, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title, slug, description, short_description, image_url, sort_order, is_active ? 1 : 0,
        meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url
      ]
    );
    
    return NextResponse.json({ success: true, data: { id: result.insertId } });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database error' }, 
      { status: 500 }
    );
  }
}
