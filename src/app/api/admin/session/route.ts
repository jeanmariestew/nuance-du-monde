import { NextResponse } from 'next/server';
import { hasValidAdminToken } from '@/lib/auth';

export async function GET() {
  const ok = await hasValidAdminToken();
  if (!ok) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ success: true, authenticated: true });
}
