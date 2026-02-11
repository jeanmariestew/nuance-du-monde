"use client";

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ImageInput from '@/components/admin/ImageInput';

export interface DayOption {
  id?: number;
  day_number: number;
  title: string;
  description?: string;
  image_url?: string;
  price_supplement?: number;
  price_currency?: string;
  is_included?: boolean;
  is_starting_price?: boolean;
  sort_order?: number;
}

interface DayOptionsEditorProps {
  options: DayOption[];
  onChange: (options: DayOption[]) => void;
  maxDays?: number;
}

export default function DayOptionsEditor({ options, onChange, maxDays = 30 }: DayOptionsEditorProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [editingOption, setEditingOption] = useState<DayOption | null>(null);
  const [showAddForm, setShowAddForm] = useState<number | null>(null);

  // Grouper les options par jour
  const optionsByDay: Record<number, DayOption[]> = {};
  options.forEach(opt => {
    if (!optionsByDay[opt.day_number]) {
      optionsByDay[opt.day_number] = [];
    }
    optionsByDay[opt.day_number].push(opt);
  });

  // Jours qui ont des options
  const daysWithOptions = Object.keys(optionsByDay).map(Number).sort((a, b) => a - b);

  const addOption = (dayNumber: number, newOption: Omit<DayOption, 'day_number'>) => {
    const option: DayOption = {
      ...newOption,
      day_number: dayNumber,
      sort_order: options.filter(o => o.day_number === dayNumber).length,
    };
    onChange([...options, option]);
    setShowAddForm(null);
  };

  const updateOption = (index: number, updatedOption: DayOption) => {
    const newOptions = [...options];
    newOptions[index] = updatedOption;
    onChange(newOptions);
    setEditingOption(null);
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const getOptionIndex = (option: DayOption) => {
    return options.findIndex(o => 
      o.day_number === option.day_number && 
      o.title === option.title && 
      o.sort_order === option.sort_order
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Options d&apos;activités par jour</h3>
        <select
          onChange={(e) => {
            const day = parseInt(e.target.value);
            if (day > 0) {
              setShowAddForm(day);
              setExpandedDay(day);
            }
          }}
          value=""
          className="text-sm rounded-md border border-neutral-300 px-3 py-1.5"
        >
          <option value="">+ Ajouter une option au jour...</option>
          {Array.from({ length: maxDays }, (_, i) => i + 1).map(day => (
            <option key={day} value={day}>Jour {day}</option>
          ))}
        </select>
      </div>

      {/* Liste des jours avec options */}
      {daysWithOptions.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Aucune option d&apos;activité configurée</p>
      ) : (
        <div className="space-y-3">
          {daysWithOptions.map(dayNumber => (
            <div key={dayNumber} className="border border-neutral-200 rounded-lg overflow-hidden">
              {/* Header du jour */}
              <button
                type="button"
                onClick={() => setExpandedDay(expandedDay === dayNumber ? null : dayNumber)}
                className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors"
              >
                <span className="font-medium text-sm">
                  Jour {dayNumber} - {optionsByDay[dayNumber].length} option(s)
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${expandedDay === dayNumber ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Options du jour */}
              {expandedDay === dayNumber && (
                <div className="p-4 space-y-3">
                  {optionsByDay[dayNumber].map((option, idx) => {
                    const globalIndex = getOptionIndex(option);
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-white border border-neutral-200 rounded-lg">
                        {option.image_url && (
                          <img
                            src={option.image_url}
                            alt={option.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{option.title}</span>
                            {option.is_included && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Inclus</span>
                            )}
                            {option.price_supplement && option.price_supplement > 0 && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                +{option.price_supplement} {option.price_currency || 'CAD'}
                              </span>
                            )}
                          </div>
                          {option.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{option.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingOption(option)}
                            className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => removeOption(globalIndex)}
                            className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Bouton ajouter */}
                  <button
                    type="button"
                    onClick={() => setShowAddForm(dayNumber)}
                    className="w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:border-yellow-500 hover:text-yellow-600 transition-colors text-sm"
                  >
                    + Ajouter une option au Jour {dayNumber}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulaire d'ajout */}
      {showAddForm !== null && (
        <OptionForm
          dayNumber={showAddForm}
          onSave={(option) => addOption(showAddForm, option)}
          onCancel={() => setShowAddForm(null)}
        />
      )}

      {/* Formulaire d'édition */}
      {editingOption && (
        <OptionForm
          dayNumber={editingOption.day_number}
          initialData={editingOption}
          onSave={(option) => {
            const index = getOptionIndex(editingOption);
            updateOption(index, { ...option, day_number: editingOption.day_number });
          }}
          onCancel={() => setEditingOption(null)}
        />
      )}
    </div>
  );
}

// Formulaire pour ajouter/éditer une option
function OptionForm({
  dayNumber,
  initialData,
  onSave,
  onCancel,
}: {
  dayNumber: number;
  initialData?: DayOption;
  onSave: (option: Omit<DayOption, 'day_number'>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [priceSupplement, setPriceSupplement] = useState<number | ''>(initialData?.price_supplement || '');
  const [priceCurrency, setPriceCurrency] = useState(initialData?.price_currency || 'CAD');
  const [isIncluded, setIsIncluded] = useState(initialData?.is_included || false);
  const [isStartingPrice, setIsStartingPrice] = useState(initialData?.is_starting_price || false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      image_url: imageUrl || undefined,
      price_supplement: priceSupplement === '' ? undefined : priceSupplement,
      price_currency: priceCurrency,
      is_included: isIncluded,
      is_starting_price: isStartingPrice,
      sort_order: initialData?.sort_order || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {initialData ? 'Modifier' : 'Ajouter'} une option - Jour {dayNumber}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre de l&apos;option *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Visite du musée d'Orsay"
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
                placeholder="Description de l'option..."
                rows={3}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>

            <ImageInput
              label="Image de l'option"
              value={imageUrl}
              onChange={setImageUrl}
              mode="both"
              placeholder="Sélectionnez une image"
              previewClassName="h-32 w-full"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplément de prix
                </label>
                <input
                  type="number"
                  value={priceSupplement}
                  onChange={(e) => setPriceSupplement(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
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
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isIncluded}
                  onChange={(e) => setIsIncluded(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">Option incluse dans le prix de base</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isStartingPrice}
                  onChange={(e) => setIsStartingPrice(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">Afficher "à partir de"</span>
              </label>
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
