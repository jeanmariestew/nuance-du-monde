import { NextResponse } from 'next/server';
import { hasValidAdminToken } from '@/lib/auth';
import { executeSqlFile } from '@/lib/sql';

export async function POST() {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await executeSqlFile('scripts/schema.sql');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Migration error:', err);
    return NextResponse.json({ success: false, error: 'Migration failed' }, { status: 500 });
  }
}
