import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const rows = await query('SELECT * FROM brochure_requests WHERE id = ?', [id]);
  if ((rows as any[]).length === 0) {
    return NextResponse.json({ success: false, error: 'Non trouvé' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: (rows as any[])[0] });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, notes } = body;

  if (!status || !['pending', 'sent', 'cancelled'].includes(status)) {
    return NextResponse.json({ success: false, error: 'Statut invalide' }, { status: 400 });
  }

  const sentAt = status === 'sent' ? ', sent_at = NOW()' : '';
  await execute(
    `UPDATE brochure_requests SET status = ?, notes = ?${sentAt} WHERE id = ?`,
    [status, notes || null, id]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await execute('DELETE FROM brochure_requests WHERE id = ?', [id]);
  return NextResponse.json({ success: true });
}
