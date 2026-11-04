import path from "path";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { resolveUploadsDirForRead } from "@/lib/uploadsDir";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getMimeType(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    case ".ogg":
      return "video/ogg";
    default:
      return "application/octet-stream";
  }
}

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

export async function GET(req: Request, context: RouteParams) {
  try {
    const params = await context.params;
    const parts: string[] = Array.isArray(params.path)
      ? params.path
      : typeof params.path === "string"
        ? [params.path]
        : [];

    const requestedPath = parts.join("/");
    const baseDir = await resolveUploadsDirForRead();
    const filePath = path.resolve(path.join(baseDir, requestedPath));

    if (!filePath.startsWith(baseDir + path.sep) && filePath !== baseDir) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stat = await fs.stat(filePath).catch(() => null);
    if (!stat || !stat.isFile()) {
      return new NextResponse("Not Found", {
        status: 404,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      });
    }

    const buffer = await fs.readFile(filePath);
    const mime = getMimeType(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Length": String(stat.size),
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch {
    return new NextResponse("Server error", {
      status: 500,
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
    });
  }
}