"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { adminApi } from "@/lib/axios";
import OptimizedImage from "@/components/OptimizedImage";

export type HomePopupMediaType = "video" | "animated_image" | "image";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  mediaType: HomePopupMediaType;
  disabled?: boolean;
};

function acceptForType(mediaType: HomePopupMediaType) {
  if (mediaType === "video") return "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov";
  if (mediaType === "animated_image") return "image/gif,image/webp,.gif,.webp";
  return "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";
}

function hintForType(mediaType: HomePopupMediaType) {
  if (mediaType === "video") return "Formats : MP4, WebM (recommandé < 50 Mo).";
  if (mediaType === "animated_image") return "Formats : GIF ou WebP animé.";
  return "Formats : JPG, PNG, WebP ou GIF.";
}

export default function MediaUploadInput({
  label,
  value,
  onChange,
  mediaType,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      // Ne pas forcer Content-Type : axios doit laisser le boundary multipart
      const res = await adminApi.post("/uploads", form, {
        headers: { "Content-Type": undefined },
        timeout: 600000,
      });
      if (res.data?.success && res.data.url) {
        onChange(res.data.url);
      } else {
        setError(res.data?.error || "Échec de l'upload");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur réseau";
      setError(message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isVideo = mediaType === "video";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-800">{label}</label>
      <p className="text-xs text-neutral-500">{hintForType(mediaType)}</p>

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          {isVideo ? (
            <video
              src={value}
              controls
              className="max-h-64 w-full object-contain bg-black"
            />
          ) : (
            <OptimizedImage
              src={value}
              alt="Aperçu média popup"
              width={800}
              height={450}
              className="max-h-64 w-full object-contain"
            />
          )}
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black"
            aria-label="Retirer le média"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="truncate border-t border-neutral-200 px-3 py-2 text-xs text-neutral-500">
            {value}
          </p>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-10 text-sm text-neutral-600 hover:border-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
        >
          <Upload className="h-6 w-6" />
          {uploading ? "Upload en cours…" : "Uploader un fichier"}
        </button>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
        >
          {value ? "Remplacer" : "Choisir un fichier"}
        </button>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Ou coller une URL (https://…)"
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptForType(mediaType)}
        className="hidden"
        onChange={handleUpload}
        disabled={disabled || uploading}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
