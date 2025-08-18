'use client';

import { useEffect, useState } from 'react';
import type { Testimonial } from '@/types';

type Editable = Partial<Testimonial> & { id?: number };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Editable>({
    client_name: '',
    testimonial_text: '',
    image_url: '',
    rating: undefined,
    is_featured: false,
    is_published: true,
    is_active: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials?active=true');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (e) {
      console.error('Failed to load testimonials', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () =>
    setForm({ client_name: '', testimonial_text: '', image_url: '', rating: undefined, is_featured: false, is_published: true, is_active: true });

  const onEdit = (t: Testimonial) => {
    setForm({
      id: t.id,
      client_name: t.client_name,
      client_avatar: t.client_avatar,
      image_url: t.image_url,
      testimonial_text: t.testimonial_text,
      rating: t.rating,
      destination_id: t.destination_id,
      travel_theme_id: t.travel_theme_id,
      is_featured: t.is_featured,
      is_published: t.is_published ?? true,
      is_active: t.is_active,
    });
  };

  const save = async () => {
    if (!form.client_name || !form.testimonial_text) return alert('Nom et témoignage requis');
    setSaving(true);
    try {
      const method = form.id ? 'PATCH' : 'POST';
      const res = await fetch('/api/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Erreur API');
      await load();
      resetForm();
      alert('Enregistré');
    } catch (e) {
      console.error('Save failed', e);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Backoffice · Témoignages</h1>

      {/* Formulaire */}
      <div className="bg-white rounded-xl border p-4 mb-8 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Nom client</span>
            <input
              className="border rounded px-3 py-2"
              value={form.client_name || ''}
              onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
              placeholder="Nom du client"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Avatar URL (optionnel)</span>
            <input
              className="border rounded px-3 py-2"
              value={form.client_avatar || ''}
              onChange={(e) => setForm((f) => ({ ...f, client_avatar: e.target.value }))}
              placeholder="https://..."
            />
          </label>
          <label className="flex flex-col md:col-span-2">
            <span className="text-sm text-gray-600 mb-1">Image de fond (image_url)</span>
            <input
              className="border rounded px-3 py-2"
              value={form.image_url || ''}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
            />
          </label>
          <label className="flex flex-col md:col-span-2">
            <span className="text-sm text-gray-600 mb-1">Témoignage</span>
            <textarea
              className="border rounded px-3 py-2 min-h-[100px]"
              value={form.testimonial_text || ''}
              onChange={(e) => setForm((f) => ({ ...f, testimonial_text: e.target.value }))}
              placeholder="Texte du témoignage"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Note (0-5)</span>
            <input
              type="number"
              min={0}
              max={5}
              className="border rounded px-3 py-2"
              value={form.rating ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value === '' ? undefined : Number(e.target.value) }))}
              placeholder="4"
            />
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} />
              <span>À la une</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} />
              <span>Publié</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
              <span>Actif</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            {form.id ? 'Mettre à jour' : 'Créer'}
          </button>
          <button onClick={resetForm} className="px-4 py-2 rounded border">
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl border">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-medium">Témoignages ({items.length})</div>
          {loading && <div className="text-sm text-gray-500">Chargement…</div>}
        </div>
        <div className="divide-y">
          {items.map((t) => (
            <div key={t.id} className="px-4 py-3 flex items-center gap-4">
              <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {t.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.image_url} alt="bg" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />)
                }
              </div>
              <div className="flex-1">
                <div className="font-medium">{t.client_name}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{t.testimonial_text}</div>
              </div>
              <div className="text-sm text-gray-700 flex items-center gap-3">
                <span className={t.is_featured ? 'text-yellow-600' : 'text-gray-400'}>★</span>
                <span>{t.is_published ? 'Publié' : 'Brouillon'}</span>
                <span>{t.is_active ? 'Actif' : 'Inactif'}</span>
              </div>
              <button className="px-3 py-1 border rounded" onClick={() => onEdit(t)}>Éditer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
