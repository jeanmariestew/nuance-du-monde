import path from "path";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const UPLOADS_DIR =
  process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");

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
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const requestedPath = (params.path || []).join("/");

    // Protection anti path traversal
    const baseDir = path.resolve(UPLOADS_DIR);
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
  } catch (e) {
    return new NextResponse("Server error", {
      status: 500,
      headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
    });
  }
}
