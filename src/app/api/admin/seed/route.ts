import { NextResponse } from 'next/server';
import { hasValidAdminToken } from '@/lib/auth';
import { executeSqlFile } from '@/lib/sql';

export async function POST() {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  try {
    await executeSqlFile('scripts/seed.sql');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Seeding error:', err);
    return NextResponse.json({ success: false, error: 'Seeding failed' }, { status: 500 });
  }
}
