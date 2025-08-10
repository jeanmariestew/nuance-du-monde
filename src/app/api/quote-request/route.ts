import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { QuoteRequest, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      destination_id,
      travel_theme_id,
      travel_type_id,
      departure_date,
      return_date,
      number_of_travelers,
      budget_range,
      special_requests
    } = body;

    // Validation des champs requis
    if (!first_name || !last_name || !email) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Le prénom, nom et email sont requis'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Format d\'email invalide'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const query = `
      INSERT INTO quote_requests (
        first_name, last_name, email, phone, destination_id, travel_theme_id,
        travel_type_id, departure_date, return_date, number_of_travelers,
        budget_range, special_requests, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `;

    const params = [
      first_name, last_name, email, phone, destination_id, travel_theme_id,
      travel_type_id, departure_date, return_date, number_of_travelers,
      budget_range, special_requests
    ];

    const [result] = await pool.execute(query, params);
    const insertResult = result as any;

    // TODO: Envoyer un email de notification à l'équipe
    // TODO: Envoyer un email de confirmation au client

    const response: ApiResponse<{ id: number }> = {
      success: true,
      data: { id: insertResult.insertId },
      message: 'Demande de devis envoyée avec succès. Nous vous contacterons bientôt!'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la demande de devis:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de l\'envoi de la demande de devis'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const status = searchParams.get('status');

    let query = `
      SELECT qr.*, d.title as destination_title, th.title as theme_title, tt.title as type_title
      FROM quote_requests qr
      LEFT JOIN destinations d ON qr.destination_id = d.id
      LEFT JOIN travel_themes th ON qr.travel_theme_id = th.id
      LEFT JOIN travel_types tt ON qr.travel_type_id = tt.id
    `;
    const params: any[] = [];

    // Filtrer par statut si spécifié
    if (status) {
      query += ' WHERE qr.status = ?';
      params.push(status);
    }

    // Ajouter l'ordre
    query += ' ORDER BY qr.created_at DESC';

    // Ajouter la pagination si spécifiée
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
      
      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }

    const [rows] = await pool.execute(query, params);
    const quoteRequests = rows as QuoteRequest[];

    const response: ApiResponse<QuoteRequest[]> = {
      success: true,
      data: quoteRequests
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de devis:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de la récupération des demandes de devis'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

