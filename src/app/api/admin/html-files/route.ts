import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { hasValidAdminToken } from '@/lib/auth';

const HTML_DIR = path.join(process.cwd(), 'public', 'html-pages');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

const HTML_EXTENSIONS = new Set(['.html', '.htm']);
const MEDIA_EXTENSIONS = new Set(['.gif', '.png', '.jpg', '.jpeg', '.webp', '.svg']);

function dirAndUrlForExt(ext: string): { dir: string; urlBase: string } | null {
  if (HTML_EXTENSIONS.has(ext)) return { dir: HTML_DIR, urlBase: '/html-pages' };
  if (MEDIA_EXTENSIONS.has(ext)) return { dir: IMAGES_DIR, urlBase: '/images' };
  return null;
}

async function ensureDirs() {
  await fs.mkdir(HTML_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
}

async function listDir(dir: string, urlBase: string) {
  const files = await fs.readdir(dir).catch(() => [] as string[]);
  return Promise.all(
    files
      .filter((f) => !f.startsWith('.'))
      .map(async (name) => {
        const stat = await fs.stat(path.join(dir, name)).catch(() => null);
        return { name, url: `${urlBase}/${name}`, size: stat?.size ?? 0, updatedAt: stat?.mtime?.toISOString() ?? null };
      })
  );
}

export async function GET() {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  await ensureDirs();
  const htmlFiles = (await listDir(HTML_DIR, '/html-pages')).filter((f) => HTML_EXTENSIONS.has(path.extname(f.name).toLowerCase()));
  const mediaFiles = (await listDir(IMAGES_DIR, '/images')).filter((f) => path.extname(f.name).toLowerCase() === '.gif');
  return NextResponse.json({ success: true, data: [...htmlFiles, ...mediaFiles] });
}

export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  await ensureDirs();
  try {
    const form = await req.formData();
    const uploaded: { name: string; url: string }[] = [];

    for (const [, value] of form.entries()) {
      if (!value || typeof value === 'string') continue;
      const file = value as File;
      const ext = path.extname(file.name).toLowerCase();
      const dest = dirAndUrlForExt(ext);
      if (!dest) return NextResponse.json({ success: false, error: `Extension non autorisée : ${ext}` }, { status: 400 });
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const bytes = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(dest.dir, safeName), bytes);
      uploaded.push({ name: safeName, url: `${dest.urlBase}/${safeName}` });
    }

    if (!uploaded.length) return NextResponse.json({ success: false, error: 'Aucun fichier valide reçu' }, { status: 400 });
    return NextResponse.json({ success: true, data: uploaded });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Erreur upload' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await hasValidAdminToken())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { name, url } = await req.json().catch(() => ({}));
  if (!name || typeof name !== 'string') return NextResponse.json({ success: false, error: 'Nom manquant' }, { status: 400 });

  const safeName = path.basename(name);
  const ext = path.extname(safeName).toLowerCase();
  const dest = dirAndUrlForExt(ext);
  if (!dest) return NextResponse.json({ success: false, error: 'Extension inconnue' }, { status: 400 });

  // Use url hint if provided to pick the right dir
  const targetDir = url?.startsWith('/images') ? IMAGES_DIR : dest.dir;
  const filePath = path.join(targetDir, safeName);
  if (!path.resolve(filePath).startsWith(path.resolve(targetDir) + path.sep)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  await fs.unlink(filePath).catch(() => {});
  return NextResponse.json({ success: true });
}
