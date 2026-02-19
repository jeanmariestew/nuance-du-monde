"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from '@/lib/axios';
import { Upload, CheckCircle, XCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';
interface FileUploadState {
  name: string;
  status: UploadStatus;
}

interface GalleryImage {
  id: number;
  filename: string;
  url: string;
  title: string;
  alt_text: string;
  tags: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export default function GalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState("");
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [imagesPerPage] = useState(20);

  // Charger les images avec pagination
  const loadImages = useCallback(async (page: number = currentPage) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedTags) params.append("tags", selectedTags);
      params.append("limit", imagesPerPage.toString());
      params.append("offset", ((page - 1) * imagesPerPage).toString());

      const res = await adminApi.get(`/gallery?${params}`);
      const data = res.data;
      
      if (data.success) {
        setImages(data.data);
        // Calculer la pagination
        const total = data.pagination?.total || data.data.length;
        setTotalImages(total);
        setTotalPages(Math.ceil(total / imagesPerPage));
      }
    } catch (error) {
      console.error("Erreur chargement galerie:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [searchTerm, selectedTags, imagesPerPage, currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset à la page 1 quand les filtres changent
    loadImages(1);
  }, [searchTerm, selectedTags]);

  // Charger quand la page change
  useEffect(() => {
    loadImages(currentPage);
  }, [currentPage]);

  // Navigation de pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Optimiser une image côté client (compression sans perte de qualité visible)
  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      // Si ce n'est pas une image ou si c'est un GIF/SVG, ne pas optimiser
      if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
        resolve(file);
        return;
      }

      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        // Limiter la taille max à 2000px tout en gardant le ratio
        const maxSize = 2000;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en blob avec qualité optimale (0.85 pour JPEG)
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = file.type === 'image/png' ? 1 : 0.85;

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              // Utiliser l'image optimisée seulement si elle est plus petite
              const optimizedFile = new File([blob], file.name, { type: outputType });
              resolve(optimizedFile);
            } else {
              // Garder l'original si l'optimisation n'aide pas
              resolve(file);
            }
          },
          outputType,
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  // Upload d'une seule image
  const uploadSingleImage = async (file: File): Promise<boolean> => {
    try {
      const optimizedFile = await optimizeImage(file);
      const formData = new FormData();
      formData.append("file", optimizedFile);
      formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
      formData.append("alt_text", file.name.replace(/\.[^/.]+$/, ""));

      const res = await adminApi.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.success;
    } catch (error) {
      console.error("Erreur upload:", error);
      return false;
    }
  };

  // Upload multiple d'images
  const handleMultipleUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    // Initialiser la queue avec tous les fichiers en pending
    const initialQueue: FileUploadState[] = fileArray.map(f => ({
      name: f.name,
      status: 'pending' as UploadStatus,
    }));
    setUploadQueue(initialQueue);
    setUploading(true);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      // Mettre à jour le statut à "uploading"
      setUploadQueue(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: 'uploading' } : item
      ));
      
      const success = await uploadSingleImage(file);
      
      // Mettre à jour le statut final
      setUploadQueue(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: success ? 'success' : 'error' } : item
      ));
    }

    setUploading(false);
    await loadImages();

    // Garder la queue visible 3 secondes après la fin
    setTimeout(() => {
      setUploadQueue([]);
    }, 3000);
  };

  // Handler pour input file
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await handleMultipleUpload(files);
    e.target.value = "";
  };

  // Drag & Drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Vérifier si on quitte vraiment la zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleMultipleUpload(files);
    }
  };

  // Mettre à jour une image
  const handleUpdate = async () => {
    if (!editingImage) return;

    try {
      const res = await adminApi.put(`/gallery/${editingImage.id}`, {
        title: editingImage.title,
        alt_text: editingImage.alt_text,
        tags: editingImage.tags,
      });
      const data = res.data;
      if (data.success) {
        await loadImages();
        setEditingImage(null);
        alert("Image mise à jour !");
      }
    } catch (error) {
      console.error("Erreur mise à jour:", error);
    }
  };

  // Supprimer une image
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette image ?")) return;

    try {
      const res = await adminApi.delete(`/gallery/${id}`);
      const data = res.data;
      if (data.success) {
        await loadImages();
        alert("Image supprimée !");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  // Composant Skeleton pour une carte d'image
  const ImageSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-3 bg-gray-200 rounded mb-3 w-1/2" />
        <div className="flex gap-1 mb-3">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-5 bg-gray-200 rounded-full w-12" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gray-200 rounded" />
          <div className="flex-1 h-8 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  // Afficher les skeletons pendant le chargement initial
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div className="h-10 bg-gray-200 rounded w-64 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
          
          {/* Upload zone skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
            <div className="h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-200" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
          
          {/* Grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ImageSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Galerie d&apos;Images</h1>
          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ← Retour
          </button>
        </div>

        {/* Upload et Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upload avec Drag & Drop */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uploader des images
              </label>
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50/50'
                } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
                
                {uploadQueue.length === 0 ? (
                  <>
                    <Upload className={`h-10 w-10 mx-auto mb-3 ${isDragging ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium text-gray-700">
                      {isDragging ? 'Déposez les images ici' : 'Glissez-déposez vos images ici'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ou cliquez pour sélectionner (plusieurs fichiers possibles)
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Les images sont automatiquement optimisées
                    </p>
                  </>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Upload {uploadQueue.filter(f => f.status === 'success').length}/{uploadQueue.length} terminé(s)
                    </p>
                    {uploadQueue.map((file, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm ${
                          file.status === 'error' ? 'bg-red-50' :
                          file.status === 'success' ? 'bg-green-50' :
                          file.status === 'uploading' ? 'bg-yellow-50' : 'bg-gray-50'
                        }`}
                      >
                        {file.status === 'pending' && (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        )}
                        {file.status === 'uploading' && (
                          <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                        )}
                        {file.status === 'success' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {file.status === 'error' && (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`truncate flex-1 ${
                          file.status === 'error' ? 'text-red-700' :
                          file.status === 'success' ? 'text-green-700' :
                          file.status === 'uploading' ? 'text-yellow-700' : 'text-gray-500'
                        }`}>
                          {file.name}
                        </span>
                        {file.status === 'error' && (
                          <span className="text-xs text-red-500">Erreur</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Titre, nom de fichier..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par tags
              </label>
              <input
                type="text"
                value={selectedTags}
                onChange={(e) => setSelectedTags(e.target.value)}
                placeholder="voyage, nature..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Grille d'images */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading && !initialLoading && (
            // Skeletons pendant le changement de page
            Array.from({ length: imagesPerPage }).map((_, i) => (
              <ImageSkeleton key={`skeleton-${i}`} />
            ))
          )}
          {!loading && images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square relative bg-gray-100">
                <OptimizedImage
                  src={image.url}
                  alt={image.alt_text || image.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate mb-1">
                  {image.title}
                </h3>
                <p className="text-xs text-gray-500 truncate mb-2">
                  {image.filename}
                </p>
                {image.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {image.tags.split(",").map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingImage(image)}
                    className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="flex-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            Aucune image dans la galerie
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {/* Première page */}
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className="px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-sm"
                  >
                    1
                  </button>
                  {currentPage > 4 && <span className="px-2 text-gray-400">...</span>}
                </>
              )}
              
              {/* Pages autour de la page courante */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                .map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      page === currentPage
                        ? 'bg-yellow-500 text-white border border-yellow-500'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              
              {/* Dernière page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2 text-gray-400">...</span>}
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-sm"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            <span className="ml-4 text-sm text-gray-500">
              {totalImages} image{totalImages > 1 ? 's' : ''} au total
            </span>
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Éditer l'image</h2>
            
            <div className="mb-4 relative h-64 bg-gray-100 rounded overflow-hidden">
              <OptimizedImage
                src={editingImage.url}
                alt={editingImage.alt_text || editingImage.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  value={editingImage.title}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texte alternatif
                </label>
                <input
                  type="text"
                  value={editingImage.alt_text}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, alt_text: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={editingImage.tags}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, tags: e.target.value })
                  }
                  placeholder="voyage, nature, montagne"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setEditingImage(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
