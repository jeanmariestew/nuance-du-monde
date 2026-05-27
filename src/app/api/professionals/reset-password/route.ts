import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { randomUUID } from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email requis' },
        { status: 400 }
      );
    }

    const rows = await query(
      'SELECT id, first_name, last_name, agency_name FROM professionals WHERE LOWER(email) = LOWER(?)',
      [email.trim()]
    );

    const professionals = rows as any[];

    if (professionals.length === 0) {
      // Ne pas révéler si l'email existe ou non (sécurité)
      return NextResponse.json({
        success: true,
        message: 'Si votre email existe dans notre système, vous recevrez un lien'
      });
    }

    const professional = professionals[0];

    // Générer un token unique
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await execute(
      'UPDATE professionals SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
      [token, expiresAt, professional.id]
    );

    // Envoyer l'email
    try {
      await sendPasswordResetEmail({
        email: email.trim(),
        first_name: professional.first_name,
        last_name: professional.last_name,
        agency_name: professional.agency_name,
      }, token);
    } catch (emailErr) {
      console.error('[reset-password] Email error:', emailErr);
      // Ne pas bloquer si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: 'Un lien de réinitialisation a été envoyé à votre email'
    });

  } catch (error) {
    console.error('[POST /api/professionals/reset-password] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi du lien' },
      { status: 500 }
    );
  }
}
