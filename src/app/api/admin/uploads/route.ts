import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { hasValidAdminToken } from '@/lib/auth';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

async function ensureDir() {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch {}
}

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  await ensureDir();
  const files = await fs.readdir(uploadsDir).catch(() => [] as string[]);
  // Return URLs relative to site root
  const items = files
    .filter((f) => !f.startsWith('.'))
    .map((name) => ({ name, url: `/uploads/${name}` }));
  return NextResponse.json({ success: true, data: items });
}

export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  await ensureDir();
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'Aucun fichier' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    const ext = path.extname(file.name) || '.bin';
    const base = path.basename(file.name, ext).replace(/[^a-z0-9-_]+/gi, '-').toLowerCase().slice(0, 50);
    const hash = crypto.createHash('md5').update(bytes).digest('hex').slice(0, 8);
    const finalName = `${base || 'file'}-${hash}${ext}`;
    const destPath = path.join(uploadsDir, finalName);
    await fs.writeFile(destPath, bytes);
    return NextResponse.json({ success: true, url: `/uploads/${finalName}`, name: finalName });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Upload error' }, { status: 500 });
  }
}
