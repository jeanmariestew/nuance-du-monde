import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Read cookie manually from request headers
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]+)/);
  const cookieToken = match ? decodeURIComponent(match[1]) : null;
  const expected = process.env.ADMIN_TOKEN || null;
  return NextResponse.json({
    success: true,
    cookiePresent: !!cookieToken,
    envPresent: !!expected,
    matches: !!cookieToken && !!expected && cookieToken === expected,
  });
}
