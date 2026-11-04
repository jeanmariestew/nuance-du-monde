import { promises as fs, constants as fsConstants } from "fs";
import path from "path";

const LOCAL_UPLOADS = path.join(process.cwd(), "public", "uploads");

/**
 * Dossier d'uploads accessible en écriture.
 * En local, UPLOADS_DIR pointe souvent vers un chemin prod inexistant → fallback.
 */
export async function resolveUploadsDir(): Promise<string> {
  const configured = process.env.UPLOADS_DIR?.trim();
  if (configured) {
    try {
      await fs.mkdir(configured, { recursive: true });
      await fs.access(configured, fsConstants.W_OK);
      return path.resolve(configured);
    } catch {
      // fall through
    }
  }
  await fs.mkdir(LOCAL_UPLOADS, { recursive: true });
  return path.resolve(LOCAL_UPLOADS);
}

/** Dossier à utiliser pour lire un fichier (essaie config puis local). */
export async function resolveUploadsDirForRead(): Promise<string> {
  const configured = process.env.UPLOADS_DIR?.trim();
  if (configured) {
    try {
      await fs.access(path.resolve(configured), fsConstants.R_OK);
      return path.resolve(configured);
    } catch {
      // fall through
    }
  }
  return path.resolve(LOCAL_UPLOADS);
}
