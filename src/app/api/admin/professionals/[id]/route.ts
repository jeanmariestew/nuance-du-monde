import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

// GET: Récupérer un professionnel par ID
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const rows = await query('SELECT * FROM professionals WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) {
      return NextResponse.json({ success: false, error: 'Non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: (rows as any[])[0] });
  } catch (error) {
    console.error('[GET /api/admin/professionals/[id]] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}

// PUT: Mettre à jour un professionnel (validation, rejet, etc.)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { status } = body;

    // Vérifier que le professionnel existe
    const existing = await query('SELECT * FROM professionals WHERE id = ?', [id]);
    if ((existing as any[]).length === 0) {
      return NextResponse.json({ success: false, error: 'Non trouvé' }, { status: 404 });
    }

    if (!status || !['pending', 'validated', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Statut invalide' }, { status: 400 });
    }

    await execute('UPDATE professionals SET status = ? WHERE id = ?', [status, id]);

    return NextResponse.json({ success: true, message: 'Professionnel mis à jour' });
  } catch (error) {
    console.error('[PUT /api/admin/professionals/[id]] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un professionnel
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await execute('DELETE FROM professionals WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Professionnel supprimé' });
  } catch (error) {
    console.error('[DELETE /api/admin/professionals/[id]] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
