"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { adminApi } from '@/lib/axios';

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
  multiple?: boolean;
  onSelectMultiple?: (images: GalleryImage[]) => void;
}

export default function ImageGalleryPicker({
  onSelect,
  onClose,
  selectedUrl,
  multiple = false,
  onSelectMultiple,
}: ImageGalleryPickerProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState("");

  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<GalleryImage[]>([]);

  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const limit = 50;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Pour éviter les races lors des recherches rapides
  const requestKey = useMemo(() => `${searchTerm}__${selectedTags}`, [searchTerm, selectedTags]);

  const buildQuery = (nextOffset: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (selectedTags) params.append("tags", selectedTags);
    params.append("limit", String(limit));
    params.append("offset", String(nextOffset));
    return params.toString();
  };

  const loadFirstPage = async () => {
    setLoading(true);
    setLoadingMore(false);
    setHasMore(true);
    setOffset(0);

    const myKey = requestKey;

    try {
      const res = await adminApi.get(`/gallery?${buildQuery(0)}`);
      const data = res.data;

      // Si le user a changé les filtres entre temps, on ignore
      if (myKey !== requestKey) return;

      if (data.success) {
        setImages(data.data || []);
        const hm = !!data.pagination?.hasMore;
        setHasMore(hm);
        setOffset(0);
      } else {
        setImages([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erreur chargement galerie:", error);
      setImages([]);
      setHasMore(false);
    } finally {
      if (myKey === requestKey) setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || loadingMore || !hasMore) return;

    const nextOffset = offset + limit;
    setLoadingMore(true);

    const myKey = requestKey;

    try {
      const res = await adminApi.get(`/gallery?${buildQuery(nextOffset)}`);
      const data = res.data;

      // Ignore si filtres ont changé
      if (myKey !== requestKey) return;

      if (data.success) {
        const newItems: GalleryImage[] = data.data || [];
        setImages((prev) => {
          const existing = new Set(prev.map((i) => i.id));
          const merged = [...prev, ...newItems.filter((i) => !existing.has(i.id))];
          return merged;
        });
        const hm = !!data.pagination?.hasMore;
        setHasMore(hm);
        setOffset(nextOffset);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erreur chargement galerie (more):", error);
    } finally {
      if (myKey === requestKey) setLoadingMore(false);
    }
  };

  // Reset + load page 1 sur changement de filtres
  useEffect(() => {
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) loadMore();
      },
      {
        root,
        rootMargin: "600px", // commence à charger avant d'être vraiment en bas
        threshold: 0.01,
      }
    );

    io.observe(target);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, loadingMore, offset, requestKey]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("alt_text", file.name);

    try {
      const res = await adminApi.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = res.data;
      if (data.success) {
        // On recharge la première page (nouvelle image en haut)
        await loadFirstPage();
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
              {multiple ? "Sélectionner des images" : "Sélectionner une image"}
              {multiple && selectedImages.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({selectedImages.length} sélectionnée{selectedImages.length > 1 ? "s" : ""})
                </span>
              )}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              {uploading && <p className="text-sm text-gray-500 mt-1">Upload en cours...</p>}
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

        {/* Bouton de validation pour mode multiple */}
        {multiple && selectedImages.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button onClick={() => setSelectedImages([])} className="text-sm text-gray-600 hover:text-gray-900">
                Tout désélectionner
              </button>
              <button
                onClick={() => {
                  if (onSelectMultiple) onSelectMultiple(selectedImages);
                  onClose();
                }}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
              >
                Ajouter {selectedImages.length} image{selectedImages.length > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}

        {/* Grille d'images + infinite scroll */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Chargement...</div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Aucune image trouvée</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image) => {
                  const isSelected = multiple
                    ? selectedImages.some((img) => img.id === image.id)
                    : selectedUrl === image.url;

                  return (
                    <button
                      key={image.id}
                      onClick={() => {
                        if (multiple) {
                          if (isSelected) {
                            setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
                          } else {
                            setSelectedImages([...selectedImages, image]);
                          }
                        } else {
                          onSelect(image);
                        }
                      }}
                      className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        isSelected ? "border-yellow-500 ring-2 ring-yellow-500" : "border-gray-200 hover:border-yellow-300"
                      }`}
                    >
                      <Image src={image.url} alt={image.alt_text} fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-black/10 bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-2">
                          <p className="text-sm font-semibold truncate">{image.title}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sentinel + loader bas */}
              <div ref={sentinelRef} className="h-10" />

              {loadingMore && (
                <div className="flex justify-center py-4 text-sm text-gray-500">Chargement…</div>
              )}

              {!hasMore && images.length > 0 && (
                <div className="flex justify-center py-4 text-xs text-gray-400">
                  Fin de la galerie
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
