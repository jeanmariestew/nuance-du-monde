"use client";

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { parseDayHeader, formatDayLabel } from '@/lib/itineraryParser';
import { plainOf, richAfterLabel, storedRichLine, stripRichTags, toItinerarySource } from '@/lib/richText';
import RichTextField from '@/components/admin/RichTextField';

// Structure d'un jour d'itinéraire
export type ItineraryDay = {
  day: number;
  // Dernier jour couvert quand l'étape dure plusieurs jours (ex. day=10, endDay=12 -> "Jour 10-12")
  endDay?: number;
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

  // Parser le texte brut (le formatage inline est conservé dans chaque section)
  const lines = toItinerarySource(text).split('\n');
  let currentDay: ItineraryDay | null = null;
  let currentSection = '';

  for (const line of lines) {
    const plain = plainOf(line);
    if (!plain) continue;

    // Détecter un nouveau jour
    const dayMatch = parseDayHeader(plain);
    if (dayMatch && dayMatch.title) {
      if (currentDay) {
        days.push(currentDay);
      }
      currentDay = {
        day: dayMatch.days[0],
        endDay: dayMatch.days.length > 1 ? dayMatch.days[dayMatch.days.length - 1] : undefined,
        location: dayMatch.title,
        activities: '',
        transports: '',
        accommodation: '',
      };
      currentSection = '';
      continue;
    }

    // Détecter les sections
    const activitiesMatch = plain.match(/^Activit[ée]s?\s*[:\-–]\s*([\s\S]*)$/i);
    const transportsMatch = plain.match(/^Transports?\s*[:\-–]\s*([\s\S]*)$/i);
    const accommodationMatch = plain.match(/^H[ée]bergements?\s*[:\-–]\s*([\s\S]*)$/i);

    if (activitiesMatch) {
      currentSection = 'activities';
      if (currentDay && activitiesMatch[1]) {
        currentDay.activities = richAfterLabel(line, plain, activitiesMatch[1]);
      }
    } else if (transportsMatch) {
      currentSection = 'transports';
      if (currentDay && transportsMatch[1]) {
        currentDay.transports = richAfterLabel(line, plain, transportsMatch[1]);
      }
    } else if (accommodationMatch) {
      currentSection = 'accommodation';
      if (currentDay && accommodationMatch[1]) {
        currentDay.accommodation = richAfterLabel(line, plain, accommodationMatch[1]);
      }
    } else if (currentDay && currentSection) {
      // Ajouter à la section courante
      const key = currentSection as keyof Pick<ItineraryDay, 'activities' | 'transports' | 'accommodation'>;
      const stored = storedRichLine(line, plain);
      if (currentDay[key]) {
        currentDay[key] += '\n' + stored;
      } else {
        currentDay[key] = stored;
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
    const covered = day.endDay && day.endDay > day.day
      ? Array.from({ length: day.endDay - day.day + 1 }, (_, i) => day.day + i)
      : [day.day];
    const parts = [`${covered.length > 1 ? 'Jours' : 'Jour'} ${formatDayLabel(covered)} : ${day.location}`];
    if (day.activities) parts.push(`Activités : ${day.activities}`);
    if (day.transports) parts.push(`Transports : ${day.transports}`);
    if (day.accommodation) parts.push(`Hébergements : ${day.accommodation}`);
    return parts.join('\n');
  }).join('\n\n');
}

// Numérote les jours à la suite (1, 2, 3...) en respectant la durée de chaque étape
function renumberDays(days: ItineraryDay[]): ItineraryDay[] {
  let next = 1;
  return days.map((d) => {
    const span = Math.max(1, (d.endDay ?? d.day) - d.day + 1);
    const start = next;
    next += span;
    return { ...d, day: start, endDay: span > 1 ? start + span - 1 : undefined };
  });
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

  // Définir la durée d'une étape (nombre de jours consécutifs au même endroit)
  const updateSpan = (index: number, span: number) => {
    const safeSpan = Math.max(1, Math.min(60, Math.floor(span) || 1));
    const newDays = [...itinerary.days];
    newDays[index] = { ...newDays[index], endDay: safeSpan > 1 ? newDays[index].day + safeSpan - 1 : undefined };
    const newItinerary = { days: renumberDays(newDays) };
    setItinerary(newItinerary);
    onChange(itineraryToText(newItinerary));
  };

  // Ajouter un jour
  const addDay = () => {
    const newDay: ItineraryDay = {
      day: 0,
      location: '',
      activities: '',
      transports: '',
      accommodation: '',
    };
    const newItinerary = { days: renumberDays([...itinerary.days, newDay]) };
    setItinerary(newItinerary);
    onChange(itineraryToText(newItinerary));
  };

  // Supprimer un jour
  const removeDay = (index: number) => {
    const newDays = renumberDays(itinerary.days.filter((_, i) => i !== index));
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
        body: JSON.stringify({ text: stripRichTags(value) }),
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
        <div className="inline-flex rounded-lg bg-neutral-200 p-1" role="group" aria-label="Mode d'édition">
          <button
            type="button"
            aria-pressed={mode === 'text'}
            onClick={() => { if (mode !== 'text') switchToText(); }}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              mode === 'text'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Texte brut
          </button>
          <button
            type="button"
            aria-pressed={mode === 'structured'}
            onClick={() => { if (mode !== 'structured') switchToStructured(); }}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              mode === 'structured'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
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

      {/* Mode texte : saisie libre, avec formatage et collage Word */}
      {mode === 'text' && (
        <RichTextField
          lists
          listScope="selection"
          value={value}
          onChange={onChange}
          minHeight={300}
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
                  <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-full bg-[--color-primary] text-white font-bold text-sm whitespace-nowrap">
                    {formatDayLabel(day.endDay && day.endDay > day.day
                      ? Array.from({ length: day.endDay - day.day + 1 }, (_, i) => day.day + i)
                      : [day.day])}
                  </span>
                  <input
                    type="text"
                    value={day.location}
                    onChange={(e) => updateDay(index, 'location', e.target.value)}
                    placeholder="Destination (ex: Paris)"
                    className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-neutral-600 whitespace-nowrap">
                    Durée
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={day.endDay && day.endDay > day.day ? day.endDay - day.day + 1 : 1}
                      onChange={(e) => updateSpan(index, parseInt(e.target.value, 10))}
                      className="w-14 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                    />
                    jour(s)
                  </label>
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
                  <RichTextField
                    lists
                    listScope="selection"
                    value={day.activities}
                    onChange={(next) => updateDay(index, 'activities', next)}
                    minHeight={60}
                    placeholder="Visite du musée, découverte de la ville..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-600 mb-1 block">
                    🚗 Transports
                  </label>
                  <RichTextField
                    lists
                    listScope="selection"
                    value={day.transports}
                    onChange={(next) => updateDay(index, 'transports', next)}
                    minHeight={40}
                    placeholder="Vol, train, bus, transfert privé..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-600 mb-1 block">
                    🏨 Hébergements
                  </label>
                  <RichTextField
                    lists
                    listScope="selection"
                    value={day.accommodation}
                    onChange={(next) => updateDay(index, 'accommodation', next)}
                    minHeight={40}
                    placeholder="Hôtel 4 étoiles, chambre d'hôtes, lodge..."
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
        <strong>Format attendu :</strong> Chaque jour doit avoir une ligne &quot;Jour X : Destination&quot; suivie des sections Activités, Transports et Hébergements sur des lignes séparées. Pour plusieurs jours au même endroit, utilisez &quot;Jours 10-12 : Destination&quot; (une bulle par jour sur le site). Le gras, l&apos;italique, la couleur, le surlignage et les listes à puces sont conservés, y compris au collage depuis Word. « Formater avec IA » réécrit le texte sans ce formatage.
      </div>
    </div>
  );
}
