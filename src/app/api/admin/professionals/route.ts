import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

// GET: Liste tous les professionnels
export async function GET(req: Request) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    let sql = 'SELECT * FROM professionals ORDER BY created_at DESC';
    const params: string[] = [];

    if (status && ['pending', 'validated', 'rejected'].includes(status)) {
      sql = 'SELECT * FROM professionals WHERE status = ? ORDER BY created_at DESC';
      params.push(status);
    }

    const rows = await query(sql, params);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('[GET /api/admin/professionals] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des professionnels' },
      { status: 500 }
    );
  }
}

// POST: Créer une nouvelle demande de professionnel (utilisé par le formulaire public)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, agency_name, first_name, last_name, certificate_number, phone } = body;

    if (!email || !agency_name || !certificate_number) {
      return NextResponse.json(
        { success: false, error: 'Email, nom d\'agence et numéro de permis requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existing = await query('SELECT id, status FROM professionals WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      const existingPro = (existing as any[])[0];
      if (existingPro.status === 'validated') {
        return NextResponse.json({ 
          success: true, 
          message: 'Compte déjà validé',
          status: 'validated',
          data: existingPro 
        });
      } else if (existingPro.status === 'pending') {
        return NextResponse.json({ 
          success: true, 
          message: 'Demande en cours de validation',
          status: 'pending' 
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Cette demande a été rejetée. Veuillez nous contacter.' },
          { status: 400 }
        );
      }
    }

    const result = await execute(
      `INSERT INTO professionals (email, agency_name, first_name, last_name, certificate_number, phone, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [email, agency_name, first_name || null, last_name || null, certificate_number, phone || null]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Demande enregistrée. Vous serez notifié une fois validé.',
      status: 'pending',
      id: result.insertId 
    });
  } catch (error) {
    console.error('[POST /api/admin/professionals] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'enregistrement' },
      { status: 500 }
    );
  }
}
