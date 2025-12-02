import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hasValidAdminToken } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const uploadsDir = '/var/www/nextapp/nuance-du-monde/public/uploads';

async function ensureDir() {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch {}
}

// GET - Récupérer toutes les images de la galerie
export async function GET(req: Request) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const tags = searchParams.get('tags');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = 'SELECT * FROM images WHERE 1=1';
    const params: any[] = [];

    if (tags) {
      sql += ' AND tags LIKE ?';
      params.push(`%${tags}%`);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR alt_text LIKE ? OR filename LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const images = await query(sql, params);

    // Compter le total
    let countSql = 'SELECT COUNT(*) as total FROM images WHERE 1=1';
    const countParams: any[] = [];
    
    if (tags) {
      countSql += ' AND tags LIKE ?';
      countParams.push(`%${tags}%`);
    }
    
    if (search) {
      countSql += ' AND (title LIKE ? OR alt_text LIKE ? OR filename LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [{ total }] = await query(countSql, countParams) as any[];

    return NextResponse.json({
      success: true,
      data: images,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error: any) {
    console.error('Gallery GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Upload une nouvelle image dans la galerie
export async function POST(req: Request) {
  if (!(await hasValidAdminToken())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  await ensureDir();

  try {
    const form = await req.formData();
    const file = form.get('file');
    const title = form.get('title') as string || '';
    const altText = form.get('alt_text') as string || '';
    const tags = form.get('tags') as string || '';

    // Vérifier que c'est un Blob/File (compatible Node.js et navigateur)
    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type MIME
    if (!file.type || !file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    
    // Générer un nom de fichier unique
    const ext = path.extname(file.name) || '.jpg';
    const base = path.basename(file.name, ext)
      .replace(/[^a-z0-9-_]+/gi, '-')
      .toLowerCase()
      .slice(0, 50);
    const hash = crypto.createHash('md5').update(bytes).digest('hex').slice(0, 8);
    const finalName = `${base || 'image'}-${hash}${ext}`;
    const destPath = path.join(uploadsDir, finalName);
    
    // Sauvegarder le fichier
    await fs.writeFile(destPath, bytes);
    
    const url = `/uploads/${finalName}`;

    // Obtenir les dimensions de l'image (optionnel, nécessite sharp ou autre lib)
    // Pour l'instant on laisse null
    const width = null;
    const height = null;

    // Insérer dans la base de données
    const result = await query(
      `INSERT INTO images 
       (filename, url, title, alt_text, tags, file_size, mime_type, width, height) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        finalName,
        url,
        title || file.name,
        altText || file.name,
        tags,
        bytes.length,
        file.type,
        width,
        height
      ]
    ) as any;

    const newImage = {
      id: result.insertId,
      filename: finalName,
      url,
      title: title || file.name,
      alt_text: altText || file.name,
      tags,
      file_size: bytes.length,
      mime_type: file.type,
      width,
      height
    };

    return NextResponse.json({
      success: true,
      data: newImage
    });
  } catch (error: any) {
    console.error('Gallery POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
