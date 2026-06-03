import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const FROM = process.env.SMTP_FROM || 'Nuance du Monde <noreply@nuancedumonde.com>';

    const result = await transporter.sendMail({
      from: FROM,
      to: 'jfidelica@gmail.com',
      subject: '🧪 Email de Test - Nuance du Monde',
      html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <!-- Header -->
        <tr>
          <td style="background:#000;padding:32px 40px;text-align:center">
            <h2 style="color:#FFFF00;margin:0">Nuance du Monde</h2>
          </td>
        </tr>
        <!-- Gold bar -->
        <tr><td style="background:#FFFF00;height:4px"></td></tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px">
            <h1 style="margin:0 0 16px;font-size:24px;color:#000">✅ Email de Test</h1>
            <p style="margin:0 0 20px;color:#666;line-height:1.6">
              Cet email a été envoyé avec succès! Le système de notification par email fonctionne correctement.
            </p>
            <p style="margin:0 0 20px;color:#666;line-height:1.6">
              <strong>Détails:</strong><br>
              Date: ${new Date().toLocaleString('fr-FR')}<br>
              Serveur: ${process.env.SMTP_HOST || 'smtp.gmail.com'}:${process.env.SMTP_PORT || 587}
            </p>
            <div style="background:#f0f0f0;padding:16px;border-radius:8px;margin:20px 0">
              <code style="color:#d63384;font-family:monospace">Email envoyé depuis: ${FROM}</code>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f4f4f4;padding:20px;text-align:center;color:#999;font-size:12px">
            <p style="margin:0">© 2026 Nuance du Monde. Tous droits réservés.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès!',
      messageId: result.messageId,
      response: result.response,
    });
  } catch (error) {
    console.error('Erreur envoi email test:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
