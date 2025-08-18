import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const [rows] = await pool.query('SELECT * FROM travel_themes ORDER BY created_at DESC');
  return NextResponse.json({ success: true, data: rows });
}

export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { title, slug, is_active = 1 } = body || {};
  if (!title || !slug) return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });
  try {
    await pool.query('INSERT INTO travel_themes (title, slug, is_active) VALUES (?, ?, ?)', [title, slug, is_active ? 1 : 0]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
