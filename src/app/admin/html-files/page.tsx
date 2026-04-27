"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { adminApi } from "@/lib/axios";
import { Upload, Trash2, Copy, Check, FileCode, FileImage, ExternalLink, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

const PAGE_SIZE = 15;

interface HtmlFile {
  name: string;
  url: string;
  size: number;
  updatedAt: string | null;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "html" || ext === "htm") return <FileCode size={18} className="text-blue-600" />;
  return <FileImage size={18} className="text-green-600" />;
}

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="p-1.5 rounded-md border border-neutral-200 disabled:opacity-30 hover:bg-neutral-100"
      >
        <ChevronLeft size={15} />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-8 h-8 text-sm rounded-md border ${p === page ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200 hover:bg-neutral-100"}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === total}
        className="p-1.5 rounded-md border border-neutral-200 disabled:opacity-30 hover:bg-neutral-100"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

function FileSection({
  title,
  icon,
  files,
  onDelete,
  onCopy,
  copiedUrl,
}: {
  title: string;
  icon: React.ReactNode;
  files: HtmlFile[];
  onDelete: (f: HtmlFile) => void;
  onCopy: (url: string) => void;
  copiedUrl: string | null;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(files.length / PAGE_SIZE);
  const paginated = files.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [files.length]);

  return (
    <section>
      <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
        {icon} {title} ({files.length})
      </h2>
      {files.length === 0 ? (
        <p className="text-sm text-neutral-400 italic">Aucun fichier trouvé.</p>
      ) : (
        <>
          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
            {paginated.map((f) => (
              <FileRow key={f.name} file={f} onDelete={onDelete} onCopy={onCopy} copiedUrl={copiedUrl} />
            ))}
          </div>
          <Pagination page={page} total={totalPages} onPage={setPage} />
        </>
      )}
    </section>
  );
}

export default function HtmlFilesPage() {
  const [files, setFiles] = useState<HtmlFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadFiles() {
    try {
      const res = await adminApi.get("/html-files");
      if (res.data.success) setFiles(res.data.data);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { loadFiles(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (!selectedFiles.length) return;
    setUploading(true);
    setStatus(null);
    try {
      const form = new FormData();
      selectedFiles.forEach((f) => form.append("file", f));
      const res = await adminApi.post("/html-files", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setStatus(`${res.data.data.length} fichier(s) uploadé(s) avec succès`);
        await loadFiles();
      } else {
        setStatus(res.data.error || "Erreur upload");
      }
    } catch (err: any) {
      setStatus(err.message || "Erreur réseau");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(file: HtmlFile) {
    if (!confirm(`Supprimer "${file.name}" ?`)) return;
    try {
      await adminApi.delete("/html-files", { data: { name: file.name, url: file.url } });
      setFiles((prev) => prev.filter((f) => f.name !== file.name));
    } catch {}
  }

  function copyUrl(url: string) {
    const full = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? files.filter((f) => f.name.toLowerCase().includes(q)) : files;
  }, [files, search]);

  const htmlFiles = filtered.filter((f) => f.name.endsWith(".html") || f.name.endsWith(".htm"));
  const mediaFiles = filtered.filter((f) => !f.name.endsWith(".html") && !f.name.endsWith(".htm"));

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold shrink-0">Signatures</h1>
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un fichier…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black bg-white"
          />
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-700 disabled:opacity-50 shrink-0"
        >
          {uploading ? <Spinner /> : <Upload size={16} />}
          {uploading ? "Upload…" : "Uploader"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".html,.htm,.gif,.png,.jpg,.jpeg,.webp,.svg"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {status && (
        <div className={`px-4 py-3 rounded-lg text-sm ${status.includes("succès") ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {status}
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl p-4 text-sm text-neutral-500">
        <p className="font-medium text-neutral-700 mb-1">Formats acceptés</p>
        <p>HTML/HTM, GIF, PNG, JPG, WEBP, SVG. Accessibles via <code className="bg-neutral-100 px-1 rounded">/html-pages/nom-du-fichier.html</code></p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-neutral-500"><Spinner /> Chargement…</div>
      ) : (
        <>
          <FileSection
            title="Pages HTML"
            icon={<FileCode size={18} className="text-blue-600" />}
            files={htmlFiles}
            onDelete={handleDelete}
            onCopy={copyUrl}
            copiedUrl={copiedUrl}
          />
          <FileSection
            title="Médias"
            icon={<FileImage size={18} className="text-green-600" />}
            files={mediaFiles}
            onDelete={handleDelete}
            onCopy={copyUrl}
            copiedUrl={copiedUrl}
          />
        </>
      )}
    </div>
  );
}

function FileRow({
  file,
  onDelete,
  onCopy,
  copiedUrl,
}: {
  file: HtmlFile;
  onDelete: (f: HtmlFile) => void;
  onCopy: (url: string) => void;
  copiedUrl: string | null;
}) {
  const isCopied = copiedUrl === file.url;
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-neutral-50">
      <FileIcon name={file.name} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-neutral-400">{formatSize(file.size)}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onCopy(file.url)}
          title="Copier l'URL"
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border border-neutral-200 hover:bg-neutral-100"
        >
          {isCopied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
          {isCopied ? "Copié !" : "Copier URL"}
        </button>
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Ouvrir"
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border border-neutral-200 hover:bg-neutral-100"
        >
          <ExternalLink size={13} />
          Ouvrir
        </a>
        <button
          onClick={() => onDelete(file)}
          title="Supprimer"
          className="p-1.5 rounded-md text-red-500 hover:bg-red-50"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
