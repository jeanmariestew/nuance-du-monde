import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  agencyName: string;
  certificateNumber: string;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('pro_session')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not set');
      return NextResponse.json(
        { success: false, error: 'Erreur de configuration serveur' },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    return NextResponse.json({
      success: true,
      data: {
        id: decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        agencyName: decoded.agencyName,
        certificateNumber: decoded.certificateNumber,
      }
    });

  } catch (error: any) {
    console.error('[GET /api/professionals/me] Error:', error);

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { success: false, error: 'Session expirée' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Non authentifié' },
      { status: 401 }
    );
  }
}
