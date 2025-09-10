import { NextRequest, NextResponse } from "next/server";
import { TravelTheme, ApiResponse } from "@/types";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const squery = "SELECT * FROM travel_themes WHERE slug = ? AND is_active = true";
    const [rows] = await query(squery, [slug]);
    const themes = rows as TravelTheme[];

    if (themes.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Thème non trouvé",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<TravelTheme> = {
      success: true,
      data: themes[0],
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Erreur lors de la récupération du thème:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Erreur lors de la récupération du thème",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
