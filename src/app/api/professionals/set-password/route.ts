import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, passwordConfirm } = body;

    if (!token || !password || !passwordConfirm) {
      return NextResponse.json(
        { success: false, error: 'Token et mot de passe requis' },
        { status: 400 }
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { success: false, error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Chercher le professionnel avec le token
    const rows = await query(
      'SELECT id, email, first_name, last_name, agency_name, certificate_number, password_set_token, password_token_expires, password_reset_token FROM professionals WHERE password_set_token = ? OR password_reset_token = ?',
      [token, token]
    );

    const professionals = rows as any[];

    if (professionals.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Token invalide' },
        { status: 404 }
      );
    }

    const professional = professionals[0];
    const now = new Date();

    // Vérifier l'expiration
    let expiresAt = null;
    let isResetFlow = false;

    if (professional.password_set_token === token) {
      expiresAt = professional.password_token_expires;
    } else if (professional.password_reset_token === token) {
      expiresAt = professional.password_reset_expires;
      isResetFlow = true;
    }

    if (expiresAt && new Date(expiresAt) < now) {
      return NextResponse.json(
        { success: false, error: 'Le lien a expiré' },
        { status: 410 }
      );
    }

    // Hash le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Mettre à jour le professionnel
    await execute(
      'UPDATE professionals SET password_hash = ?, password_set_token = NULL, password_token_expires = NULL, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
      [passwordHash, professional.id]
    );

    // Créer le JWT
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not set');
      return NextResponse.json(
        { success: false, error: 'Erreur de configuration serveur' },
        { status: 500 }
      );
    }

    const sessionToken = jwt.sign(
      {
        id: professional.id,
        email: professional.email,
        firstName: professional.first_name,
        lastName: professional.last_name,
        agencyName: professional.agency_name,
        certificateNumber: professional.certificate_number,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Mot de passe configuré avec succès',
      redirect: '/espace-pro'
    });

    // Set HTTP-only cookie
    response.cookies.set('pro_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('[POST /api/professionals/set-password] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la configuration du mot de passe' },
      { status: 500 }
    );
  }
}
