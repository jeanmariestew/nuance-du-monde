"use client";

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

// Structure d'un jour d'itinéraire
export type ItineraryDay = {
  day: number;
  location: string;
  activities: string;
  transports: string;
  accommodation: string;
};

// Structure complète de l'itinéraire
export type ItineraryData = {
  days: ItineraryDay[];
};

interface ItineraryEditorProps {
  value: string; // La description brute ou JSON stringifié
  onChange: (value: string) => void;
}

// Parse le texte brut en structure d'itinéraire
function parseTextToItinerary(text: string): ItineraryData {
  const days: ItineraryDay[] = [];
  
  // Essayer de parser comme JSON d'abord
  try {
    const parsed = JSON.parse(text);
    if (parsed.days && Array.isArray(parsed.days)) {
      return parsed as ItineraryData;
    }
  } catch {
    // Pas du JSON, continuer avec le parsing texte
  }

  // Parser le texte brut
  const lines = text.split('\n');
  let currentDay: ItineraryDay | null = null;
  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Détecter un nouveau jour
    const dayMatch = trimmed.match(/^Jour\s*(\d+)\s*[:\-–]\s*(.+)$/i);
    if (dayMatch) {
      if (currentDay) {
        days.push(currentDay);
      }
      currentDay = {
        day: parseInt(dayMatch[1]),
        location: dayMatch[2].trim(),
        activities: '',
        transports: '',
        accommodation: '',
      };
      currentSection = '';
      continue;
    }

    // Détecter les sections
    const activitiesMatch = trimmed.match(/^Activit[ée]s?\s*[:\-–]\s*(.*)$/i);
    const transportsMatch = trimmed.match(/^Transports?\s*[:\-–]\s*(.*)$/i);
    const accommodationMatch = trimmed.match(/^H[ée]bergements?\s*[:\-–]\s*(.*)$/i);

    if (activitiesMatch) {
      currentSection = 'activities';
      if (currentDay && activitiesMatch[1]) {
        currentDay.activities = activitiesMatch[1].trim();
      }
    } else if (transportsMatch) {
      currentSection = 'transports';
      if (currentDay && transportsMatch[1]) {
        currentDay.transports = transportsMatch[1].trim();
      }
    } else if (accommodationMatch) {
      currentSection = 'accommodation';
      if (currentDay && accommodationMatch[1]) {
        currentDay.accommodation = accommodationMatch[1].trim();
      }
    } else if (currentDay && currentSection) {
      // Ajouter à la section courante
      const key = currentSection as keyof Pick<ItineraryDay, 'activities' | 'transports' | 'accommodation'>;
      if (currentDay[key]) {
        currentDay[key] += '\n' + trimmed;
      } else {
        currentDay[key] = trimmed;
      }
    }
  }

  if (currentDay) {
    days.push(currentDay);
  }

  return { days };
}

// Convertir la structure en texte formaté
function itineraryToText(data: ItineraryData): string {
  return data.days.map(day => {
    const parts = [`Jour ${day.day} : ${day.location}`];
    if (day.activities) parts.push(`Activités : ${day.activities}`);
    if (day.transports) parts.push(`Transports : ${day.transports}`);
    if (day.accommodation) parts.push(`Hébergements : ${day.accommodation}`);
    return parts.join('\n');
  }).join('\n\n');
}

export default function ItineraryEditor({ value, onChange }: ItineraryEditorProps) {
  const [mode, setMode] = useState<'text' | 'structured'>('text');
  const [itinerary, setItinerary] = useState<ItineraryData>({ days: [] });
  const [formatting, setFormatting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchroniser avec la valeur externe
  useEffect(() => {
    if (mode === 'structured') {
      setItinerary(parseTextToItinerary(value));
    }
  }, [value, mode]);

  // Passer en mode structuré
  const switchToStructured = () => {
    setItinerary(parseTextToItinerary(value));
    setMode('structured');
  };

  // Passer en mode texte
  const switchToText = () => {
    onChange(itineraryToText(itinerary));
    setMode('text');
  };

  // Mettre à jour un jour
  const updateDay = (index: number, field: keyof ItineraryDay, newValue: string | number) => {
    const newDays = [...itinerary.days];
    newDays[index] = { ...newDays[index], [field]: newValue };
    const newItinerary = { days: newDays };
    setItinerary(newItinerary);
    onChange(itineraryToText(newItinerary));
  };

  // Ajouter un jour
  const addDay = () => {
    const newDay: ItineraryDay = {
      day: itinerary.days.length + 1,
      location: '',
      activities: '',
      transports: '',
      accommodation: '',
    };
    const newItinerary = { days: [...itinerary.days, newDay] };
    setItinerary(newItinerary);
    onChange(itineraryToText(newItinerary));
  };

  // Supprimer un jour
  const removeDay = (index: number) => {
    const newDays = itinerary.days.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
    const newItinerary = { days: newDays };
    setItinerary(newItinerary);
    onChange(itineraryToText(newItinerary));
  };

  // Formater avec l'API Gemini
  const formatWithAI = async () => {
    setFormatting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/format-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: value }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur API');
      }

      const formattedText = data.formattedText || '';
      
      if (formattedText) {
        onChange(formattedText);
        setItinerary(parseTextToItinerary(formattedText));
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du formatage');
    } finally {
      setFormatting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border border-neutral-300 overflow-hidden">
          <button
            type="button"
            onClick={() => mode === 'structured' ? switchToText() : null}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'text' 
                ? 'bg-[--color-primary] text-white' 
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            Texte brut
          </button>
          <button
            type="button"
            onClick={() => mode === 'text' ? switchToStructured() : null}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'structured' 
                ? 'bg-[--color-primary] text-white' 
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            Éditeur structuré
          </button>
        </div>

        <Button
          type="button"
          onClick={formatWithAI}
          disabled={formatting || !value}
          className="text-xs px-3 py-1.5"
        >
          {formatting ? (
            <span className="inline-flex items-center gap-1"><Spinner size={12} /> Formatage...</span>
          ) : (
            'Formater avec IA'
          )}
        </Button>

      </div>

      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {error}
        </div>
      )}

      {/* Mode texte brut */}
      {mode === 'text' && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[300px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary] font-mono"
          placeholder={`Jour 1 : Paris
Activités : Visite de la Tour Eiffel, promenade sur les Champs-Élysées
Transports : Vol international
Hébergements : Hôtel 4 étoiles centre-ville

Jour 2 : Lyon
Activités : Découverte du Vieux Lyon, dégustation gastronomique
Transports : Train TGV (2h)
Hébergements : Chambre d'hôtes`}
        />
      )}

      {/* Mode éditeur structuré */}
      {mode === 'structured' && (
        <div className="space-y-4">
          {itinerary.days.map((day, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[--color-primary] text-white font-bold text-sm">
                    {day.day}
                  </span>
                  <input
                    type="text"
                    value={day.location}
                    onChange={(e) => updateDay(index, 'location', e.target.value)}
                    placeholder="Destination (ex: Paris)"
                    className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeDay(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Supprimer
                </button>
              </div>

              <div className="grid gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-600 mb-1 block">
                    🎯 Activités
                  </label>
                  <textarea
                    value={day.activities}
                    onChange={(e) => updateDay(index, 'activities', e.target.value)}
                    placeholder="Visite du musée, découverte de la ville..."
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm min-h-[60px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-600 mb-1 block">
                    🚗 Transports
                  </label>
                  <textarea
                    value={day.transports}
                    onChange={(e) => updateDay(index, 'transports', e.target.value)}
                    placeholder="Vol, train, bus, transfert privé..."
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm min-h-[40px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-600 mb-1 block">
                    🏨 Hébergements
                  </label>
                  <textarea
                    value={day.accommodation}
                    onChange={(e) => updateDay(index, 'accommodation', e.target.value)}
                    placeholder="Hôtel 4 étoiles, chambre d'hôtes, lodge..."
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm min-h-[40px]"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addDay}
            className="w-full py-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:border-[--color-primary] hover:text-[--color-primary] transition-colors text-sm font-medium"
          >
            + Ajouter un jour
          </button>
        </div>
      )}

      {/* Aide */}
      <div className="text-xs text-neutral-500 bg-neutral-100 px-3 py-2 rounded-md">
        <strong>Format attendu :</strong> Chaque jour doit avoir une ligne &quot;Jour X : Destination&quot; suivie des sections Activités, Transports et Hébergements sur des lignes séparées.
      </div>
    </div>
  );
}
