"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from '@/lib/axios';

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
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState("");
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  // Charger les images
  const loadImages = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedTags) params.append("tags", selectedTags);

      const res = await adminApi.get(`/gallery?${params}`);
      const data = res.data;
      
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

  // Upload d'image
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
        await loadImages();
        alert("Image uploadée avec succès !");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Galerie d'Images</h1>
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
            {/* Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uploader une image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              {uploading && <p className="text-sm text-gray-500 mt-2">Upload en cours...</p>}
            </div>

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
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square relative bg-gray-100">
                <img
                  src={image.url}
                  alt={image.alt_text}
                  className="w-full h-full object-cover"
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

        {images.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune image dans la galerie
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Éditer l'image</h2>
            
            <div className="mb-4">
              <img
                src={editingImage.url}
                alt={editingImage.alt_text}
                className="w-full h-64 object-contain bg-gray-100 rounded"
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
