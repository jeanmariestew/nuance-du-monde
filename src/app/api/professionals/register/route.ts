import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendPendingConfirmationEmail } from '@/lib/email';

interface RegisterRequest {
  first_name: string;
  last_name: string;
  certificate_number: string;
  email: string;
  agency_name?: string;
  phone?: string;
}

async function sendToGHL(data: RegisterRequest & { opc_verified: boolean }) {
  try {
    // Envoyer à GHL comme lead
    // Note: À configurer avec les clés GHL appropriées
    const ghlPayload = {
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      customField_certificateNumber: data.certificate_number,
      customField_agencyName: data.agency_name,
      customField_opcVerified: data.opc_verified ? 'Oui' : 'Non',
      tags: ['agent-voyage', data.opc_verified ? 'opc-verifie' : 'en-attente'],
    };

    // Placeholder - À compléter avec l'API GHL réelle
    console.log('[GHL] Lead créé:', ghlPayload);
    return true;
  } catch (error) {
    console.error('[GHL] Erreur envoi:', error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as RegisterRequest;
    const { first_name, last_name, certificate_number, email, agency_name, phone } = body;

    // Validation
    if (!first_name || !last_name || !certificate_number || !email) {
      return NextResponse.json(
        { success: false, error: 'Prénom, nom, permis et email requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existing = await query(
      'SELECT id FROM professionals WHERE LOWER(email) = LOWER(?)',
      [email.trim()]
    );

    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    // OPC check désactivé - toujours 'pending' à l'inscription
    const status = 'pending';
    const opcVerified = 0;

    // Créer l'agent en BD
    await query(
      `INSERT INTO professionals (
        first_name,
        last_name,
        certificate_number,
        email,
        agency_name,
        phone,
        status,
        opc_verified,
        opc_checked_at,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        first_name.trim(),
        last_name.trim(),
        certificate_number.trim(),
        email.trim(),
        agency_name?.trim() || null,
        phone?.trim() || null,
        status,
        opcVerified,
      ]
    );

    // Envoyer aussi à GHL
    const ghlData = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      certificate_number: certificate_number.trim(),
      email: email.trim(),
      agency_name: agency_name?.trim(),
      phone: phone?.trim(),
      opc_verified: opcVerified === 1,
    };

    await sendToGHL(ghlData);

    // Envoyer l'email de confirmation
    try {
      await sendPendingConfirmationEmail({
        email: email.trim(),
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        agency_name: agency_name?.trim() || '',
      });
    } catch (emailErr) {
      console.error('[REGISTER] Email error:', emailErr);
      // Ne pas bloquer si l'email échoue
    }

    // Retourner le résultat
    return NextResponse.json({
      success: true,
      data: {
        message: 'Votre inscription a été reçue. Vous allez recevoir un email de confirmation.',
        status,
        opc_verified: opcVerified === 1,
        email: email.trim(),
      },
    });
  } catch (error: any) {
    console.error('[POST /api/professionals/register] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur lors de l\'enregistrement',
      },
      { status: 500 }
    );
  }
}
