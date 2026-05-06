import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// POST: Authentification agent par prénom + nom + numéro de permis
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { first_name, last_name, certificate_number } = body;

    if (!first_name || !last_name || !certificate_number) {
      return NextResponse.json(
        { success: false, error: 'Prénom, nom et numéro de permis requis' },
        { status: 400 }
      );
    }

    const rows = await query(
      `SELECT id, email, agency_name, first_name, last_name, certificate_number, status, opc_verified
       FROM professionals
       WHERE LOWER(first_name) = LOWER(?) AND LOWER(last_name) = LOWER(?) AND certificate_number = ?`,
      [first_name.trim(), last_name.trim(), certificate_number.trim()]
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

    return NextResponse.json({
      success: true,
      data: {
        id: professional.id,
        email: professional.email,
        agencyName: professional.agency_name,
        firstName: professional.first_name,
        lastName: professional.last_name,
        certificateNumber: professional.certificate_number,
        opcVerified: professional.opc_verified === 1,
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
