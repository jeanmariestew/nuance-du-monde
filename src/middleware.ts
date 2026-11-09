import { NextRequest, NextResponse } from "next/server";

function isAdminAuthenticated(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const cookieToken = req.cookies.get("admin_token")?.value;
  return cookieToken === expected;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rewrite /uploads/* => /api/uploads/*
  if (pathname.startsWith("/uploads/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/api" + pathname;
    return NextResponse.rewrite(url);
  }

  // Pages admin : session cookie obligatoire (sauf login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAdminAuthenticated(req)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      if (pathname !== "/admin") {
        url.searchParams.set("next", pathname);
      }
      return NextResponse.redirect(url);
    }
  }

  // Déjà connecté → inutile de rester sur /admin/login
  if (pathname.startsWith("/admin/login") && isAdminAuthenticated(req)) {
    const next = req.nextUrl.searchParams.get("next");
    const url = req.nextUrl.clone();
    url.pathname =
      next && next.startsWith("/admin") && !next.startsWith("/admin/login")
        ? next
        : "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/uploads/:path*", "/admin/:path*"],
};
