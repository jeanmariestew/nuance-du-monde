import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST() {
  try {
    const result = await query(
      `INSERT INTO professionals (
        email,
        first_name,
        last_name,
        certificate_number,
        agency_name,
        status,
        created_at
      ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        'validated',
        NOW()
      )`,
      [
        'test@nuance.com',
        'Jean',
        'Testeur',
        'OPC-2026-12345',
        'Agence Test'
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Agent de test créé',
      credentials: {
        first_name: 'Jean',
        last_name: 'Testeur',
        certificate_number: 'OPC-2026-12345'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Erreur création agent'
    }, { status: 500 });
  }
}
