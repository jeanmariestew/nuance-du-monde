import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST: Vérifier l'authentification d'un professionnel
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, certificate_number } = body;

    if (!email || !certificate_number) {
      return NextResponse.json(
        { success: false, error: 'Email et numéro de permis requis' },
        { status: 400 }
      );
    }

    const rows = await query(
      'SELECT id, email, agency_name, certificate_number, status FROM professionals WHERE email = ? AND certificate_number = ?',
      [email, certificate_number]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Identifiants incorrects ou compte non enregistré' },
        { status: 401 }
      );
    }

    const professional = (rows as any[])[0];

    if (professional.status === 'pending') {
      return NextResponse.json({
        success: false,
        error: 'Votre demande est en cours de validation. Vous serez notifié par email.',
        status: 'pending'
      }, { status: 403 });
    }

    if (professional.status === 'rejected') {
      return NextResponse.json({
        success: false,
        error: 'Votre demande a été rejetée. Veuillez nous contacter pour plus d\'informations.',
        status: 'rejected'
      }, { status: 403 });
    }

    // Professionnel validé
    return NextResponse.json({
      success: true,
      data: {
        id: professional.id,
        email: professional.email,
        agencyName: professional.agency_name,
        certificateNumber: professional.certificate_number,
        isAuthenticated: true
      }
    });
  } catch (error) {
    console.error('[POST /api/professionals/auth] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'authentification' },
      { status: 500 }
    );
  }
}
