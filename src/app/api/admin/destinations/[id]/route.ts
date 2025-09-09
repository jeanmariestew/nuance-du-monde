import { NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
  const rows = await query('SELECT * FROM destinations WHERE id = ?', [id]);
  const items = rows as any[];
  if (!items.length) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  let item = items[0] as any;
  if (item.available_dates) {
    try { item.available_dates = JSON.parse(item.available_dates); } catch {}
  }
  return NextResponse.json({ success: true, data: item });
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
    banner_image_url = null,
    price_from = null,
    price_currency = 'CAD',
    duration_days = null,
    duration_nights = null,
    group_size_min = null,
    group_size_max = null,
    available_dates = null,
    sort_order = 0,
    is_active = 1,
  } = body || {};
  if (!title || !slug) return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });

  try {
    await query(
      `UPDATE destinations SET title=?, slug=?, description=?, short_description=?, image_url=?, banner_image_url=?, price_from=?, price_currency=?, duration_days=?, duration_nights=?, group_size_min=?, group_size_max=?, available_dates=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
      [title, slug, description, short_description, image_url, banner_image_url, price_from, price_currency, duration_days, duration_nights, group_size_min, group_size_max, available_dates ? JSON.stringify(available_dates) : null, sort_order, is_active ? 1 : 0, id]
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
    await query('DELETE FROM destinations WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
