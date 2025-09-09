import { NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

interface DescribeRow {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string | null;
  Extra: string;
}

async function detectColumns(): Promise<{ keyCol: string; valueCol: string }> {
  const rows = await query('DESCRIBE settings') as DescribeRow[];
  const cols = rows.map(r => r.Field);
  return {
    keyCol: cols.includes('setting_key') ? 'setting_key' : 'key',
    valueCol: cols.includes('setting_value') ? 'setting_value' : 'value'
  };
}

interface SettingRow {
  k: string;
  v: string;
}

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const { keyCol, valueCol } = await detectColumns();
    const rows = await query(`SELECT ${keyCol} as k, ${valueCol} as v FROM settings`) as SettingRow[];
    const settings: Record<string, string> = {};
    rows.forEach(r => {
      settings[r.k] = r.v;
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Erreur settings' }, { status: 500 });
  }
}

interface UpdateResult {
  affectedRows: number;
}

export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const entries = Object.entries(body || {});
  if (!entries.length) return NextResponse.json({ success: false, error: 'No settings provided' }, { status: 400 });
  try {
    const { keyCol, valueCol } = await detectColumns();
    for (const [key, value] of entries) {
      const res = await query(`UPDATE settings SET ${valueCol} = ? WHERE ${keyCol} = ?`, [String(value), key]) as unknown as UpdateResult;
      if (res.affectedRows === 0) {
        await query(`INSERT INTO settings (${keyCol}, ${valueCol}) VALUES (?, ?)`, [key, String(value)]);
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}
