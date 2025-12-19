import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rewrite /uploads/* => /api/uploads/*
  if (pathname.startsWith("/uploads/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/api" + pathname; // /api/uploads/...
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/uploads/:path*"],
};
