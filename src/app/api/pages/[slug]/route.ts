import { NextRequest, NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { Page, ApiResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const squery = 'SELECT * FROM pages WHERE slug = ? AND is_active = true';
    const rows = await query(squery, [slug]);
    const pages = rows as Page[];

    if (pages.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Page non trouvée'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const page = pages[0];

    const response: ApiResponse<Page> = {
      success: true,
      data: page
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération de la page:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la récupération de la page'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

