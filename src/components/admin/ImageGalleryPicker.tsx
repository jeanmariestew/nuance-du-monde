"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface GalleryImage {
  id: number;
  filename: string;
  url: string;
  title: string;
  alt_text: string;
  tags: string;
}

interface ImageGalleryPickerProps {
  onSelect: (image: GalleryImage) => void;
  onClose: () => void;
  selectedUrl?: string;
}

export default function ImageGalleryPicker({
  onSelect,
  onClose,
  selectedUrl,
}: ImageGalleryPickerProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadImages = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedTags) params.append("tags", selectedTags);

      const res = await fetch(`/api/admin/gallery?${params}`);
      const data = await res.json();

      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error("Erreur chargement galerie:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [searchTerm, selectedTags]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("alt_text", file.name);

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        await loadImages();
        onSelect(data.data);
      } else {
        alert("Erreur: " + data.error);
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Sélectionner une image
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Filtres et Upload */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              {uploading && (
                <p className="text-sm text-gray-500 mt-1">Upload en cours...</p>
              )}
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />

            <input
              type="text"
              value={selectedTags}
              onChange={(e) => setSelectedTags(e.target.value)}
              placeholder="Tags..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Grille d'images */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Chargement...</div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Aucune image trouvée</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => onSelect(image)}
                  className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedUrl === image.url
                      ? "border-yellow-500 ring-2 ring-yellow-500"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt_text}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-2">
                      <p className="text-sm font-semibold truncate">
                        {image.title}
                      </p>
                    </div>
                  </div>
                  {selectedUrl === image.url && (
                    <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
