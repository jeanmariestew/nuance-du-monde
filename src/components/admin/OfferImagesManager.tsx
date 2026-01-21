"use client";

import { useState } from "react";
import Image from "next/image";
import { X, GripVertical } from "lucide-react";
import ImageInput from "./ImageInput";

interface OfferImage {
  id?: number;
  image_url: string;
  image_type: 'main' | 'gallery' | 'banner';
  alt_text: string;
  sort_order: number;
}

interface OfferImagesManagerProps {
  images: OfferImage[];
  onChange: (images: OfferImage[]) => void;
}

export default function OfferImagesManager({ images, onChange }: OfferImagesManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddImage = (url: string, type: 'main' | 'gallery' | 'banner' = 'gallery') => {
    const newImage: OfferImage = {
      image_url: url,
      image_type: type,
      alt_text: '',
      sort_order: images.length
    };
    onChange([...images, newImage]);
  };

  const handleUpdateImage = (index: number, updates: Partial<OfferImage>) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], ...updates };
    onChange(updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // Mettre à jour les sort_order
    newImages.forEach((img, i) => {
      img.sort_order = i;
    });

    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Section d'ajout */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Ajouter des images</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Image principale</label>
            <ImageInput
              label=""
              value=""
              onChange={(url) => handleAddImage(url, 'main')}
              mode="both"
              placeholder="Ajouter"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Image bannière</label>
            <ImageInput
              label=""
              value=""
              onChange={(url) => handleAddImage(url, 'banner')}
              mode="both"
              placeholder="Ajouter"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Image galerie</label>
            <ImageInput
              label=""
              value=""
              onChange={(url) => handleAddImage(url, 'gallery')}
              mode="both"
              placeholder="Ajouter"
            />
          </div>
        </div>
      </div>

      {/* Liste des images */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Images ajoutées ({images.length})
            </h3>
            <p className="text-xs text-gray-500">
              💡 Glissez-déposez pour réorganiser
            </p>
          </div>

          <div className="space-y-2">
            {images.map((img, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-start gap-3 p-3 bg-white border-2 rounded-lg transition-all ${
                  draggedIndex === index
                    ? 'border-yellow-400 shadow-lg opacity-50'
                    : 'border-gray-200 hover:border-gray-300'
                } cursor-move`}
              >
                {/* Drag handle */}
                <div className="shrink-0 mt-2 text-gray-400 hover:text-gray-600">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Image preview */}
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || 'Preview'}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Métadonnées */}
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={img.image_type}
                      onChange={(e) => handleUpdateImage(index, { 
                        image_type: e.target.value as 'main' | 'gallery' | 'banner' 
                      })}
                      className="text-sm rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    >
                      <option value="gallery">Galerie</option>
                      <option value="main">Principale</option>
                      <option value="banner">Bannière</option>
                    </select>

                    <input
                      type="number"
                      value={img.sort_order}
                      onChange={(e) => handleUpdateImage(index, { 
                        sort_order: Number(e.target.value) 
                      })}
                      placeholder="Ordre"
                      className="w-20 text-sm rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>

                  <input
                    type="text"
                    value={img.alt_text}
                    onChange={(e) => handleUpdateImage(index, { alt_text: e.target.value })}
                    placeholder="Texte alternatif (description de l'image)"
                    className="w-full text-sm rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  />

                  <p className="text-xs text-gray-500 truncate">
                    {img.image_url}
                  </p>
                </div>

                {/* Bouton supprimer */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="shrink-0 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  title="Supprimer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
