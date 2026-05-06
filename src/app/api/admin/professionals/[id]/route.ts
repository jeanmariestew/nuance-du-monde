import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';
import { sendProValidationEmail, sendProRejectionEmail } from '@/lib/email';

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

// PUT: Mettre à jour un professionnel (validation, rejet, opc_verified…)
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
    const { status, opc_verified } = body;

    const existing = await query('SELECT * FROM professionals WHERE id = ?', [id]);
    if ((existing as any[]).length === 0) {
      return NextResponse.json({ success: false, error: 'Non trouvé' }, { status: 404 });
    }

    const professional = (existing as any[])[0];
    const oldStatus = professional.status;

    const updates: string[] = [];
    const vals: unknown[] = [];

    if (status && ['pending', 'validated', 'rejected'].includes(status)) {
      updates.push('status = ?');
      vals.push(status);
    }

    if (typeof opc_verified === 'boolean') {
      updates.push('opc_verified = ?');
      vals.push(opc_verified ? 1 : 0);
      if (opc_verified) {
        updates.push('opc_checked_at = NOW()');
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'Aucun champ à mettre à jour' }, { status: 400 });
    }

    vals.push(id);
    await execute(`UPDATE professionals SET ${updates.join(', ')} WHERE id = ?`, vals);

    // Envoi d'email si changement de statut vers validated ou rejected
    if (status && status !== oldStatus) {
      try {
        if (status === 'validated') {
          await sendProValidationEmail({
            email:       professional.email,
            first_name:  professional.first_name,
            last_name:   professional.last_name,
            agency_name: professional.agency_name,
          });
        } else if (status === 'rejected') {
          await sendProRejectionEmail({
            email:       professional.email,
            first_name:  professional.first_name,
            last_name:   professional.last_name,
            agency_name: professional.agency_name,
          });
        }
      } catch (emailErr) {
        console.error('[PUT /api/admin/professionals/[id]] Email error:', emailErr);
        // On ne bloque pas la réponse si l'email échoue
      }
    }

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
