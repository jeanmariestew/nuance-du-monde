import { NextResponse } from 'next/server';
import { getAdminTokenFromEnv } from '@/lib/auth';

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || '';
  let provided: string | null = null;
  if (contentType.includes('application/json')) {
    const body = await req.json().catch(() => ({}));
    provided = body?.token ?? null;
  } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    provided = (form.get('token') as string) || null;
  }

  const expected = getAdminTokenFromEnv();
  if (!expected) {
    return NextResponse.json({ success: false, error: 'ADMIN_TOKEN non configuré' }, { status: 500 });
  }
  if (!provided || provided !== expected) {
    return NextResponse.json({ success: false, error: 'Token invalide' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_token', expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
