"use client";

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ImageInput from '@/components/admin/ImageInput';

export interface HotelImage {
  id?: number;
  image_url: string;
  alt_text?: string;
  sort_order?: number;
}

export interface OfferHotel {
  id?: number;
  name: string;
  location?: string;
  description?: string;
  sort_order?: number;
  images?: HotelImage[];
}

interface HotelEditorProps {
  hotels: OfferHotel[];
  onChange: (hotels: OfferHotel[]) => void;
}

export default function HotelEditor({ hotels, onChange }: HotelEditorProps) {
  const [editingHotel, setEditingHotel] = useState<OfferHotel | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const addHotel = (newHotel: OfferHotel) => {
    onChange([...hotels, { ...newHotel, sort_order: hotels.length }]);
    setShowAddForm(false);
  };

  const updateHotel = (index: number, updatedHotel: OfferHotel) => {
    const newHotels = [...hotels];
    newHotels[index] = updatedHotel;
    onChange(newHotels);
    setEditingHotel(null);
    setEditingIndex(null);
  };

  const removeHotel = (index: number) => {
    onChange(hotels.filter((_, i) => i !== index));
  };

  const moveHotel = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === hotels.length - 1)
    ) {
      return;
    }
    const newHotels = [...hotels];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newHotels[index], newHotels[newIndex]] = [newHotels[newIndex], newHotels[index]];
    onChange(newHotels);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Hôtels</h3>
        <Button type="button" onClick={() => setShowAddForm(true)} className="text-sm">
          + Ajouter un hôtel
        </Button>
      </div>

      {hotels.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Aucun hôtel configuré</p>
      ) : (
        <div className="space-y-3">
          {hotels.map((hotel, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
                    {hotel.location && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {hotel.location}
                      </span>
                    )}
                  </div>
                  {hotel.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{hotel.description}</p>
                  )}
                  {hotel.images && hotel.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {hotel.images.slice(0, 4).map((img, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={img.image_url}
                          alt={img.alt_text || hotel.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ))}
                      {hotel.images.length > 4 && (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                          +{hotel.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveHotel(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveHotel(index, 'down')}
                    disabled={index === hotels.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingHotel(hotel);
                      setEditingIndex(index);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHotel(index)}
                    className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <HotelForm
          onSave={addHotel}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingHotel && editingIndex !== null && (
        <HotelForm
          initialData={editingHotel}
          onSave={(hotel) => updateHotel(editingIndex, hotel)}
          onCancel={() => {
            setEditingHotel(null);
            setEditingIndex(null);
          }}
        />
      )}
    </div>
  );
}

function HotelForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: OfferHotel;
  onSave: (hotel: OfferHotel) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [images, setImages] = useState<HotelImage[]>(initialData?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, { image_url: newImageUrl.trim(), sort_order: images.length }]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      images,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {initialData ? 'Modifier' : 'Ajouter'} un hôtel
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l&apos;hôtel *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Zanzibar Bay Resort 4*"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localisation (nom du lieu)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Zanzibar, Tanzanie"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de l'hôtel : style, prestations, vue, ambiance..."
                rows={4}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos
              </label>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.image_url}
                        alt={img.alt_text || `Image ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <ImageInput
                  label=""
                  value={newImageUrl}
                  onChange={setNewImageUrl}
                  mode="both"
                  placeholder="URL de l'image ou sélectionner"
                  previewClassName="hidden"
                />
                <Button type="button" onClick={addImage} disabled={!newImageUrl.trim()} className="shrink-0">
                  Ajouter
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
              Annuler
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={!name.trim()}>
              {initialData ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
