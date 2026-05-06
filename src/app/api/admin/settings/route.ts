import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

interface DescribeRow { Field: string; }

interface Cols { keyCol: string; valueCol: string }

let cachedCols: Cols | null = null;

async function detectColumns(): Promise<Cols> {
  if (cachedCols) return cachedCols;
  const rows = await query('DESCRIBE settings') as DescribeRow[];
  const cols = rows.map(r => r.Field);
  const keyCol   = cols.includes('setting_key') ? 'setting_key'   : cols.includes('name') ? 'name' : 'key';
  const valueCol = cols.includes('setting_value') ? 'setting_value' : cols.includes('value_text') ? 'value_text' : 'value';
  cachedCols = { keyCol, valueCol };
  return cachedCols;
}

interface SettingRow { k: string; v: string }
interface UpdateResult { affectedRows: number }

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const { keyCol, valueCol } = await detectColumns();
    const rows = await query(`SELECT ${keyCol} as k, ${valueCol} as v FROM settings`) as SettingRow[];
    const settings: Record<string, string> = {};
    rows.forEach(r => { settings[r.k] = r.v ?? ''; });
    return NextResponse.json({ success: true, data: settings });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Erreur settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const entries = Object.entries(body || {});
  if (!entries.length) return NextResponse.json({ success: false, error: 'No settings provided' }, { status: 400 });
  try {
    const { keyCol, valueCol } = await detectColumns();
    for (const [key, value] of entries) {
      const res = await query(
        `UPDATE settings SET ${valueCol} = ? WHERE ${keyCol} = ?`,
        [String(value), key]
      ) as unknown as UpdateResult;
      if (res.affectedRows === 0) {
        await query(`INSERT INTO settings (${keyCol}, ${valueCol}) VALUES (?, ?)`, [key, String(value)]);
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}
