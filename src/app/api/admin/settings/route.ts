import { NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';

async function detectColumns(): Promise<{ keyCol: string; valueCol: string }> {
  const cols = await query("SHOW COLUMNS FROM settings");
  const names = (cols as any[]).map((c) => c.Field as string);
  const keyCandidates = ['key', 'name', 'setting_key'];
  const valCandidates = ['value', 'val', 'setting_value'];
  const keyCol = keyCandidates.find((c) => names.includes(c));
  const valueCol = valCandidates.find((c) => names.includes(c));
  if (!keyCol || !valueCol) {
    throw new Error('Table settings incompatible: colonnes introuvables');
  }
  return { keyCol, valueCol };
}

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const { keyCol, valueCol } = await detectColumns();
    const rows = await query(`SELECT ${keyCol} AS k, ${valueCol} AS v FROM settings`);
    const settings: Record<string, string> = {};
    (rows as any[]).forEach((r) => {
      settings[r.k] = r.v;
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Erreur settings' }, { status: 500 });
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
      const res = await query(`UPDATE settings SET ${valueCol} = ? WHERE ${keyCol} = ?`, [String(value), key]);
      if (res.affectedRows === 0) {
        await query(`INSERT INTO settings (${keyCol}, ${valueCol}) VALUES (?, ?)`, [key, String(value)]);
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
