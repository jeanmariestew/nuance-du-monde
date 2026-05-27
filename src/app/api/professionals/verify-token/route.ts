import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token requis' },
        { status: 400 }
      );
    }

    const rows = await query(
      'SELECT id, email, first_name, last_name, password_token_expires, password_reset_expires FROM professionals WHERE password_set_token = ? OR password_reset_token = ?',
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
    const expiresAt = professional.password_token_expires || professional.password_reset_expires;
    if (expiresAt && new Date(expiresAt) < now) {
      return NextResponse.json(
        { success: false, error: 'Le lien a expiré' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        email: professional.email,
        firstName: professional.first_name,
        lastName: professional.last_name,
      }
    });

  } catch (error) {
    console.error('[GET /api/professionals/verify-token] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la vérification du token' },
      { status: 500 }
    );
  }
}
