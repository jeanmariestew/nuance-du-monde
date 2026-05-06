import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET(req: Request) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    let sql = 'SELECT * FROM brochure_requests ORDER BY created_at DESC';
    const params: string[] = [];

    if (status && ['pending', 'sent', 'cancelled'].includes(status)) {
      sql = 'SELECT * FROM brochure_requests WHERE status = ? ORDER BY created_at DESC';
      params.push(status);
    }

    const rows = await query(sql, params);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('[GET /api/admin/brochure-requests] Error:', error);
    return NextResponse.json({ success: false, error: 'Erreur' }, { status: 500 });
  }
}

// POST public: soumettre une demande de brochure (pas de token requis)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { first_name, last_name, email, agency_name, phone, address, quantity } = body;

    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { success: false, error: 'Prénom, nom et email requis' },
        { status: 400 }
      );
    }

    const result = await execute(
      `INSERT INTO brochure_requests (first_name, last_name, email, agency_name, phone, address, quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, agency_name || null, phone || null, address || null, quantity || 1]
    );

    return NextResponse.json({
      success: true,
      message: 'Demande enregistrée. Nous vous enverrons la brochure dans les meilleurs délais.',
      id: result.insertId
    });
  } catch (error) {
    console.error('[POST /api/admin/brochure-requests] Error:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
  }
}
