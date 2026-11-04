import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { hasValidAdminToken } from '@/lib/auth';
import { resolveUploadsDir } from '@/lib/uploadsDir';

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const uploadsDir = await resolveUploadsDir();
    const files = await fs.readdir(uploadsDir).catch(() => [] as string[]);
    const items = files
      .filter((f) => !f.startsWith('.'))
      .map((name) => ({ name, url: `/uploads/${name}` }));
    return NextResponse.json({ success: true, data: items });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Erreur lecture uploads';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const uploadsDir = await resolveUploadsDir();
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'Aucun fichier' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    const fileName = 'name' in file && typeof file.name === 'string' ? file.name : 'file.bin';
    const ext = path.extname(fileName) || '.bin';
    const base = path.basename(fileName, ext).replace(/[^a-z0-9-_]+/gi, '-').toLowerCase().slice(0, 50);
    const hash = crypto.createHash('md5').update(bytes).digest('hex').slice(0, 8);
    const finalName = `${base || 'file'}-${hash}${ext}`;
    const destPath = path.join(uploadsDir, finalName);
    await fs.writeFile(destPath, bytes);
    await fs.stat(destPath);
    return NextResponse.json({ success: true, url: `/uploads/${finalName}`, name: finalName });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Upload error';
    console.error('[uploads] POST failed:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
