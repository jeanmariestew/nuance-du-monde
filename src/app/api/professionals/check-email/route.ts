import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

type CheckEmailStatus = 'not_found' | 'pending' | 'validated_no_password' | 'validated_has_password' | 'rejected';

interface CheckEmailResponse {
  success: boolean;
  status?: CheckEmailStatus;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      const response: CheckEmailResponse = {
        success: false,
        error: 'Email requis'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const rows = await query(
      'SELECT id, status, password_hash FROM professionals WHERE LOWER(email) = LOWER(?)',
      [email.trim()]
    );

    const professionals = rows as any[];

    if (professionals.length === 0) {
      const response: CheckEmailResponse = {
        success: true,
        status: 'not_found'
      };
      return NextResponse.json(response);
    }

    const professional = professionals[0];

    if (professional.status === 'rejected') {
      const response: CheckEmailResponse = {
        success: true,
        status: 'rejected'
      };
      return NextResponse.json(response);
    }

    if (professional.status === 'pending') {
      const response: CheckEmailResponse = {
        success: true,
        status: 'pending'
      };
      return NextResponse.json(response);
    }

    if (professional.status === 'validated') {
      const hasPassword = !!professional.password_hash;
      const response: CheckEmailResponse = {
        success: true,
        status: hasPassword ? 'validated_has_password' : 'validated_no_password'
      };
      return NextResponse.json(response);
    }

    const response: CheckEmailResponse = {
      success: false,
      error: 'État du compte inconnu'
    };
    return NextResponse.json(response, { status: 500 });

  } catch (error) {
    console.error('[POST /api/professionals/check-email] Error:', error);
    const response: CheckEmailResponse = {
      success: false,
      error: 'Erreur lors de la vérification'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
