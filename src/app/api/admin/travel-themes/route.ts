import { NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const rows = await query('SELECT * FROM travel_themes ORDER BY created_at DESC');
  return NextResponse.json({ success: true, data: rows });
}

export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { 
    title, 
    slug, 
    description = null,
    short_description = null,
    image_url = null,
    banner_image_url = null,
    sort_order = 0,
    is_active = 1 
  } = body || {};
  if (!title || !slug) return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });
  try {
    const [res]: any = await query(
      'INSERT INTO travel_themes (title, slug, description, short_description, image_url, banner_image_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [title, slug, description, short_description, image_url, banner_image_url, sort_order, is_active ? 1 : 0]
    );
    return NextResponse.json({ success: true, id: res.insertId });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
