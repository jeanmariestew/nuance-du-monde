import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Clés autorisées à être lues publiquement
const PUBLIC_KEYS = ['pro_video_url', 'particulier_video_url'];

interface DescribeRow { Field: string }
interface SettingRow  { k: string; v: string }

let cachedKeyCol: string | null = null;
let cachedValCol: string | null = null;

async function getColNames() {
  if (cachedKeyCol) return { keyCol: cachedKeyCol, valueCol: cachedValCol! };
  const rows = await query('DESCRIBE settings') as DescribeRow[];
  const cols = rows.map(r => r.Field);
  cachedKeyCol   = cols.includes('setting_key') ? 'setting_key'   : cols.includes('name') ? 'name' : 'key';
  cachedValCol   = cols.includes('setting_value') ? 'setting_value' : cols.includes('value_text') ? 'value_text' : 'value';
  return { keyCol: cachedKeyCol, valueCol: cachedValCol };
}

export async function GET() {
  try {
    const { keyCol, valueCol } = await getColNames();
    const placeholders = PUBLIC_KEYS.map(() => '?').join(',');
    const rows = await query(
      `SELECT ${keyCol} as k, ${valueCol} as v FROM settings WHERE ${keyCol} IN (${placeholders})`,
      PUBLIC_KEYS
    ) as SettingRow[];
    const data: Record<string, string> = {};
    rows.forEach(r => { data[r.k] = r.v ?? ''; });
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ success: false, data: {} });
  }
}
