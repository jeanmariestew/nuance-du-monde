import { NextRequest, NextResponse } from 'next/server';
import {query} from '@/lib/db';
import { NewsletterSubscription, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation de l'email
    if (!email) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'L\'email est requis'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Format d\'email invalide'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Vérifier si l'email existe déjà
    const checkQuery = 'SELECT id, is_active FROM newsletter_subscriptions WHERE email = ?';
    const existingRows = await query(checkQuery, [email]);
    const existing = existingRows as NewsletterSubscription[];

    if (existing.length > 0) {
      const subscription = existing[0];
      
      if (subscription.is_active) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Cet email est déjà abonné à notre newsletter'
        };
        return NextResponse.json(response, { status: 409 });
      } else {
        // Réactiver l'abonnement
        const updateQuery = `
          UPDATE newsletter_subscriptions 
          SET is_active = true, subscribed_at = CURRENT_TIMESTAMP, unsubscribed_at = NULL 
          WHERE email = ?
        `;
        await query(updateQuery, [email]);

        const response: ApiResponse<{ id: number }> = {
          success: true,
          data: { id: subscription.id! },
          message: 'Abonnement réactivé avec succès!'
        };
        return NextResponse.json(response);
      }
    }

    // Créer un nouvel abonnement
    const insertQuery = 'INSERT INTO newsletter_subscriptions (email, is_active) VALUES (?, true)';
    const result = await query(insertQuery, [email]);
    const insertResult = result as any;

    // TODO: Envoyer un email de bienvenue

    const response: ApiResponse<{ id: number }> = {
      success: true,
      data: { id: insertResult.insertId },
      message: 'Abonnement à la newsletter réussi!'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'abonnement à la newsletter:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors de l\'abonnement à la newsletter'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'L\'email est requis'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const squery = `
      UPDATE newsletter_subscriptions 
      SET is_active = false, unsubscribed_at = CURRENT_TIMESTAMP 
      WHERE email = ? AND is_active = true
    `;
    
    const result = await query(squery, [email]);
    const updateResult = result as any;

    if (updateResult.affectedRows === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Abonnement non trouvé ou déjà désactivé'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Désabonnement réussi'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors du désabonnement:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Erreur lors du désabonnement'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

