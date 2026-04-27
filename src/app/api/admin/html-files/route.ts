import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { hasValidAdminToken } from '@/lib/auth';

const HTML_PAGES_DIR = path.join(process.cwd(), 'public', 'html-pages');

const ALLOWED_EXTENSIONS = new Set(['.html', '.htm', '.gif', '.png', '.jpg', '.jpeg', '.webp', '.svg']);

async function ensureDir() {
  await fs.mkdir(HTML_PAGES_DIR, { recursive: true });
}

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  await ensureDir();
  const files = await fs.readdir(HTML_PAGES_DIR).catch(() => [] as string[]);
  const items = await Promise.all(
    files
      .filter((f) => !f.startsWith('.'))
      .map(async (name) => {
        const filePath = path.join(HTML_PAGES_DIR, name);
        const stat = await fs.stat(filePath).catch(() => null);
        return {
          name,
          url: `/html-pages/${name}`,
          size: stat?.size ?? 0,
          updatedAt: stat?.mtime?.toISOString() ?? null,
        };
      })
  );
  return NextResponse.json({ success: true, data: items });
}

export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  await ensureDir();
  try {
    const form = await req.formData();
    const uploaded: { name: string; url: string }[] = [];

    for (const [, value] of form.entries()) {
      if (!value || typeof value === 'string') continue;
      const file = value as File;
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json({ success: false, error: `Extension non autorisée : ${ext}` }, { status: 400 });
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const destPath = path.join(HTML_PAGES_DIR, safeName);
      const bytes = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(destPath, bytes);
      uploaded.push({ name: safeName, url: `/html-pages/${safeName}` });
    }

    if (!uploaded.length) return NextResponse.json({ success: false, error: 'Aucun fichier valide reçu' }, { status: 400 });
    return NextResponse.json({ success: true, data: uploaded });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Erreur upload' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { name } = await req.json().catch(() => ({}));
  if (!name || typeof name !== 'string') return NextResponse.json({ success: false, error: 'Nom manquant' }, { status: 400 });

  const safeName = path.basename(name);
  const filePath = path.join(HTML_PAGES_DIR, safeName);
  const base = path.resolve(HTML_PAGES_DIR);
  if (!path.resolve(filePath).startsWith(base + path.sep)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  await fs.unlink(filePath).catch(() => {});
  return NextResponse.json({ success: true });
}
