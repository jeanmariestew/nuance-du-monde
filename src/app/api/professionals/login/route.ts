import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const rows = await query(
      'SELECT id, email, first_name, last_name, agency_name, certificate_number, status, password_hash, opc_verified FROM professionals WHERE LOWER(email) = LOWER(?)',
      [email.trim()]
    );

    const professionals = rows as any[];

    if (professionals.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const professional = professionals[0];

    // Vérifier le statut
    if (professional.status === 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Votre accès a été refusé. Contactez-nous pour plus d\'informations.' },
        { status: 403 }
      );
    }

    if (professional.status === 'pending') {
      return NextResponse.json(
        { success: false, error: 'Votre compte est en attente de validation' },
        { status: 403 }
      );
    }

    if (professional.status !== 'validated') {
      return NextResponse.json(
        { success: false, error: 'État du compte invalide' },
        { status: 403 }
      );
    }

    // Vérifier le mot de passe
    if (!professional.password_hash) {
      return NextResponse.json(
        { success: false, error: 'Veuillez d\'abord configurer votre mot de passe' },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, professional.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Créer le JWT
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not set');
      return NextResponse.json(
        { success: false, error: 'Erreur de configuration serveur' },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        id: professional.id,
        email: professional.email,
        firstName: professional.first_name,
        lastName: professional.last_name,
        agencyName: professional.agency_name,
        certificateNumber: professional.certificate_number,
        opcVerified: professional.opc_verified === 1,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      data: {
        id: professional.id,
        email: professional.email,
        firstName: professional.first_name,
        lastName: professional.last_name,
        agencyName: professional.agency_name,
        certificateNumber: professional.certificate_number,
        opcVerified: professional.opc_verified === 1,
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('pro_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('[POST /api/professionals/login] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
