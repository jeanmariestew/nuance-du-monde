import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
  const [rows] = await pool.query('SELECT * FROM travel_types WHERE id = ?', [id]);
  const items = rows as any[];
  if (!items.length) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: items[0] });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });

  const body = await req.json().catch(() => ({} as any));
  const {
    title,
    slug,
    description = null,
    short_description = null,
    image_url = null,
    sort_order = 0,
    is_active = 1,
  } = body || {};
  if (!title || !slug) return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });

  try {
    await pool.query(
      `UPDATE travel_types SET title=?, slug=?, description=?, short_description=?, image_url=?, sort_order=?, is_active=? WHERE id=?`,
      [title, slug, description, short_description, image_url, sort_order, is_active ? 1 : 0, id]
    );
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
  try {
    await pool.query('DELETE FROM travel_types WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
