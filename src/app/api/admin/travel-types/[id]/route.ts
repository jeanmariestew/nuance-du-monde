import { NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic'; // Prevent static optimization

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await hasValidAdminToken())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id: paramId } = await params;
    const id = Number(paramId);
    if (!id) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
    }
    
    const rows = await query('SELECT * FROM travel_types WHERE id = ?', [id]);
    const items = rows as unknown[];
    
    if (!items.length) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: items[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let connection;
  try {
    if (!(await hasValidAdminToken())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id: paramId } = await params;
    const id = Number(paramId);
    if (!id) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
    }
    
    const body = await req.json().catch(() => ({}));
    const {
      title,
      slug,
      description = '',
      short_description = '',
      image_url = '',
      sort_order = 0,
      is_active = 1,
    } = body || {};
    
    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'title et slug requis' }, { status: 400 });
    }
    
    await query(
      `UPDATE travel_types 
       SET title=?, slug=?, description=?, short_description=?, image_url=?, sort_order=?, is_active=?, updated_at=NOW() 
       WHERE id=?`,
      [title, slug, description, short_description, image_url, sort_order, is_active ? 1 : 0, id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: error || 'Database error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await hasValidAdminToken())) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id: paramId } = await params;
    const id = Number(paramId);
    if (!id) {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
    }
    
    await query('DELETE FROM travel_types WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: error || 'Database error' }, 
      { status: 500 }
    );
  }
}
