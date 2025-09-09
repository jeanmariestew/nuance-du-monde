import { NextRequest, NextResponse } from "next/server";
import { TravelType, ApiResponse } from "@/types";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const squery = "SELECT * FROM travel_types WHERE slug = ? AND is_active = true";
    const rows = await query(squery, [slug]);
    const types = rows as TravelType[];

    if (types.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Type de voyage non trouvé",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<TravelType> = {
      success: true,
      data: types[0],
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Erreur lors de la récupération du type de voyage:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Erreur lors de la récupération du type de voyage",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
