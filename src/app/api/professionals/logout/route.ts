import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Déconnexion réussie'
  });

  response.cookies.set('pro_session', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/'
  });

  return response;
}
