"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ImageGalleryPicker from "./ImageGalleryPicker";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { adminApi } from '@/lib/axios';

// Types pour supporter simple et multiple
type SingleValue = string;
type MultipleValue = string[];

interface BaseImageInputProps {
  label: string;
  disabled?: boolean;
  mode?: "upload" | "gallery" | "both";
  placeholder?: string;
  previewClassName?: string;
}

interface SingleImageInputProps extends BaseImageInputProps {
  value: SingleValue;
  onChange: (url: SingleValue) => void;
  multiple?: false;
  maxImages?: never;
}

interface MultipleImageInputProps extends BaseImageInputProps {
  value: MultipleValue;
  onChange: (urls: MultipleValue) => void;
  multiple: true;
  maxImages?: number;
}

type ImageInputProps = SingleImageInputProps | MultipleImageInputProps;

export default function ImageInput(props: ImageInputProps) {
  const {
    label,
    value,
    onChange,
    disabled = false,
    mode = "both",
    placeholder,
    multiple = false,
    maxImages = 10,
    previewClassName = "h-40 w-40",
  } = props;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug: log quand le modal devrait s'ouvrir
  useEffect(() => {
    if (showGalleryPicker) {
      console.log('ImageInput: Gallery picker opened for:', label);
    }
  }, [showGalleryPicker, label]);

  const isMultiple = multiple;
  const values = isMultiple ? (value as string[]) : [];
  const singleValue = !isMultiple ? (value as string) : "";
  const defaultPlaceholder = isMultiple ? "Ajouter des images" : "Choisir une image";

  // Upload (simple ou multiple)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Vérifier le nombre max pour multiple
    if (isMultiple && values.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images autorisées`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      // Upload chaque fichier
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await adminApi.post('/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const result = response.data;
        if (!result.url) throw new Error(result.error || "Upload failed");

        uploadedUrls.push(result.url);
      }

      // Mettre à jour selon le mode
      if (isMultiple) {
        (onChange as (urls: string[]) => void)([...values, ...uploadedUrls]);
      } else {
        (onChange as (url: string) => void)(uploadedUrls[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Sélection depuis la galerie (simple)
  const handleGallerySelect = (image: { url: string }) => {
    if (!isMultiple) {
      (onChange as (url: string) => void)(image.url);
      setShowGalleryPicker(false);
    }
  };

  // Sélection multiple depuis la galerie
  const handleGallerySelectMultiple = (images: { url: string }[]) => {
    if (isMultiple) {
      if (values.length + images.length > maxImages) {
        setError(`Maximum ${maxImages} images autorisées`);
        return;
      }
      const newUrls = images.map(img => img.url);
      (onChange as (urls: string[]) => void)([...values, ...newUrls]);
      setShowGalleryPicker(false);
    }
  };

  // Supprimer une image (mode multiple)
  const handleRemove = (index: number) => {
    if (isMultiple) {
      const newValues = values.filter((_, i) => i !== index);
      (onChange as (urls: string[]) => void)(newValues);
    }
  };

  // Drag & drop pour réorganiser
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!isMultiple) return;
    
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (dragIndex === dropIndex) return;

    const newValues = [...values];
    const [removed] = newValues.splice(dragIndex, 1);
    newValues.splice(dropIndex, 0, removed);
    
    (onChange as (urls: string[]) => void)(newValues);
  };

  const canAddMore = !isMultiple || values.length < maxImages;

  // Rendu mode simple
  if (!isMultiple) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>

        {/* Boutons d'action */}
        <div className="flex items-center gap-3">
          {(mode === "upload" || mode === "both") && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
                disabled={disabled || uploading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Téléchargement..." : (placeholder || defaultPlaceholder)}
              </button>
            </>
          )}

          {(mode === "gallery" || mode === "both") && (
            <button
              type="button"
              onClick={() => setShowGalleryPicker(true)}
              disabled={disabled || uploading}
              className="rounded-md bg-yellow-50 py-2 px-3 text-sm font-semibold text-yellow-700 shadow-sm ring-1 ring-inset ring-yellow-300 hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📸 Galerie
            </button>
          )}

          {singleValue && (
            <span className="text-sm text-gray-500 truncate flex-1">
              {singleValue.split("/").pop()}
            </span>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {singleValue && (
          <div className="mt-2">
            <div className={`${previewClassName} relative rounded-md overflow-hidden border border-gray-200`}>
              <Image src={singleValue} alt="Preview" fill className="object-cover" />
            </div>
          </div>
        )}

        {showGalleryPicker && (
          <ImageGalleryPicker
            selectedUrl={singleValue}
            onSelect={handleGallerySelect}
            onClose={() => setShowGalleryPicker(false)}
          />
        )}
      </div>
    );
  }

  // Rendu mode multiple
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          <span className="ml-2 text-xs text-gray-500">
            ({values.length}/{maxImages})
          </span>
        </label>
      </div>

      {canAddMore && (
        <div className="flex items-center gap-3">
          {(mode === "upload" || mode === "both") && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
                disabled={disabled || uploading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="inline-flex items-center gap-2 rounded-md bg-white py-2 px-4 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Téléchargement..." : (placeholder || defaultPlaceholder)}
              </button>
            </>
          )}

          {(mode === "gallery" || mode === "both") && (
            <button
              type="button"
              onClick={() => setShowGalleryPicker(true)}
              disabled={disabled || uploading}
              className="inline-flex items-center gap-2 rounded-md bg-yellow-50 py-2 px-4 text-sm font-semibold text-yellow-700 shadow-sm ring-1 ring-inset ring-yellow-300 hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ImageIcon className="w-4 h-4" />
              Galerie
            </button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {values.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-yellow-400 cursor-move transition-all"
            >
              <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {index + 1}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>
      )}

      {values.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Aucune image sélectionnée</p>
          <p className="text-xs text-gray-400 mt-1">
            Cliquez sur les boutons ci-dessus pour ajouter des images
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        💡 Glissez-déposez les images pour les réorganiser
      </p>

      {showGalleryPicker && (
        <ImageGalleryPicker
          selectedUrl=""
          onSelect={handleGallerySelect}
          onClose={() => setShowGalleryPicker(false)}
          multiple={true}
          onSelectMultiple={handleGallerySelectMultiple}
        />
      )}
    </div>
  );
}
