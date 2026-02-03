"use client";

import { useState, useCallback } from 'react';
import Button from '@/components/ui/Button';
import ImageInput from '@/components/admin/ImageInput';

export interface ExtensionImage {
  id?: number;
  image_url: string;
  alt_text?: string;
  sort_order?: number;
}

export interface OfferExtension {
  id?: number;
  title: string;
  subtitle?: string;
  description?: string;
  duration_days?: number;
  duration_nights?: number;
  price?: number;
  price_currency?: string;
  price_note?: string;
  itinerary?: string;
  sort_order?: number;
  images?: ExtensionImage[];
}

interface ExtensionEditorProps {
  extensions: OfferExtension[];
  onChange: (extensions: OfferExtension[]) => void;
}

export default function ExtensionEditor({ extensions, onChange }: ExtensionEditorProps) {
  const [editingExtension, setEditingExtension] = useState<OfferExtension | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const addExtension = (newExtension: OfferExtension) => {
    onChange([...extensions, { ...newExtension, sort_order: extensions.length }]);
    setShowAddForm(false);
  };

  const updateExtension = (index: number, updatedExtension: OfferExtension) => {
    const newExtensions = [...extensions];
    newExtensions[index] = updatedExtension;
    onChange(newExtensions);
    setEditingExtension(null);
    setEditingIndex(null);
  };

  const removeExtension = (index: number) => {
    onChange(extensions.filter((_, i) => i !== index));
  };

  const moveExtension = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === extensions.length - 1)
    ) {
      return;
    }
    const newExtensions = [...extensions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newExtensions[index], newExtensions[newIndex]] = [newExtensions[newIndex], newExtensions[index]];
    onChange(newExtensions);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Extensions / Prolongations</h3>
        <Button type="button" onClick={() => setShowAddForm(true)} className="text-sm">
          + Ajouter une extension
        </Button>
      </div>

      {/* Liste des extensions */}
      {extensions.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Aucune extension configurée</p>
      ) : (
        <div className="space-y-3">
          {extensions.map((ext, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-900">{ext.title}</h4>
                    {ext.duration_days && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        {ext.duration_days} jour{ext.duration_days > 1 ? 's' : ''}
                        {ext.duration_nights ? ` / ${ext.duration_nights} nuit${ext.duration_nights > 1 ? 's' : ''}` : ''}
                      </span>
                    )}
                    {ext.price && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        +{ext.price} {ext.price_currency || 'CAD'}
                      </span>
                    )}
                  </div>
                  {ext.subtitle && (
                    <p className="text-sm text-gray-600 mt-1">{ext.subtitle}</p>
                  )}
                  {ext.images && ext.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {ext.images.slice(0, 4).map((img, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={img.image_url}
                          alt={img.alt_text || ext.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ))}
                      {ext.images.length > 4 && (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
                          +{ext.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveExtension(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveExtension(index, 'down')}
                    disabled={index === extensions.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingExtension(ext);
                      setEditingIndex(index);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExtension(index)}
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

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <ExtensionForm
          onSave={addExtension}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Formulaire d'édition */}
      {editingExtension && editingIndex !== null && (
        <ExtensionForm
          initialData={editingExtension}
          onSave={(ext) => updateExtension(editingIndex, ext)}
          onCancel={() => {
            setEditingExtension(null);
            setEditingIndex(null);
          }}
        />
      )}
    </div>
  );
}

// Formulaire pour ajouter/éditer une extension
function ExtensionForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: OfferExtension;
  onSave: (extension: OfferExtension) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [durationDays, setDurationDays] = useState<number | ''>(initialData?.duration_days || '');
  const [durationNights, setDurationNights] = useState<number | ''>(initialData?.duration_nights || '');
  const [price, setPrice] = useState<number | ''>(initialData?.price || '');
  const [priceCurrency, setPriceCurrency] = useState(initialData?.price_currency || 'CAD');
  const [priceNote, setPriceNote] = useState(initialData?.price_note || '');
  const [itinerary, setItinerary] = useState(initialData?.itinerary || '');
  const [images, setImages] = useState<ExtensionImage[]>(initialData?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);

  const formatWithAI = useCallback(async () => {
    if (!itinerary.trim() || isFormatting) return;
    
    setIsFormatting(true);
    try {
      const response = await fetch('/api/admin/format-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: itinerary }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du formatage');
      }
      
      const data = await response.json();
      if (data.formatted) {
        setItinerary(data.formatted);
      }
    } catch (error) {
      console.error('Erreur formatage IA:', error);
      alert('Erreur lors du formatage avec l\'IA');
    } finally {
      setIsFormatting(false);
    }
  }, [itinerary, isFormatting]);

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
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim() || undefined,
      duration_days: durationDays === '' ? undefined : durationDays,
      duration_nights: durationNights === '' ? undefined : durationNights,
      price: price === '' ? undefined : price,
      price_currency: priceCurrency,
      price_note: priceNote.trim() || undefined,
      itinerary: itinerary.trim() || undefined,
      images,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {initialData ? 'Modifier' : 'Ajouter'} une extension
          </h3>

          <div className="space-y-4">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre de l&apos;extension *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Prolongation Jordanie"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Sous-titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sous-titre
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ex: 4 jours/3 nuits + 1 nuit au Caire au retour"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Durée */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (jours)
                </label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="4"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (nuits)
                </label>
                <input
                  type="number"
                  value={durationNights}
                  onChange={(e) => setDurationNights(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="3"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Prix */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix supplément
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1100"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Devise
                </label>
                <input
                  type="text"
                  value={priceCurrency}
                  onChange={(e) => setPriceCurrency(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note prix
                </label>
                <input
                  type="text"
                  value={priceNote}
                  onChange={(e) => setPriceNote(e.target.value)}
                  placeholder="Base 30 pax"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description courte de l'extension..."
                rows={2}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            {/* Itinéraire */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Programme / Itinéraire
                </label>
                <Button
                  type="button"
                  onClick={formatWithAI}
                  disabled={isFormatting || !itinerary.trim()}
                  className="text-xs px-3 py-1"
                >
                  {isFormatting ? 'Formatage...' : 'Formater avec IA'}
                </Button>
              </div>
              <textarea
                value={itinerary}
                onChange={(e) => setItinerary(e.target.value)}
                placeholder="Jour 14 : Le Caire > Amman > Mer morte&#10;Transfert en fin de matinée...&#10;&#10;Jour 15 : Mer morte > Petra&#10;Déjeuner à l'hôtel..."
                rows={8}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Collez le texte brut et cliquez sur &quot;Formater avec IA&quot; pour structurer automatiquement le programme.
              </p>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              
              {/* Liste des images */}
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

              {/* Ajouter une image */}
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
            <Button type="button" onClick={handleSubmit} disabled={!title.trim()}>
              {initialData ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
