"use client";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

async function jsonFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, { credentials: 'include', ...(init || {}) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data;
}

type RefItem = { id: number; title: string; slug: string };

type OfferData = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  image_url: string;
  is_active: 0 | 1;
  price: number | null;
  price_currency: string | null;
  duration_days: number | null;
  duration_nights: number | null;
  available_dates: string[];
  typeIds: number[];
  themeIds: number[];
  destinationIds: number[];
};

export default function AdminOfferEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const [offer, setOffer] = useState<OfferData | null>(null);
  const [types, setTypes] = useState<RefItem[]>([]);
  const [themes, setThemes] = useState<RefItem[]>([]);
  const [destinations, setDestinations] = useState<RefItem[]>([]);
  const [uploads, setUploads] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resolvedParams = await params;
        const resolvedId = Number(resolvedParams.id);
        setId(resolvedId);
        
        if (!resolvedId) {
          if (mounted) setError('ID invalide');
          return;
        }
        
        const [o, t, th, d] = await Promise.all([
          jsonFetch(`/api/admin/offers/${resolvedId}`),
          jsonFetch(`/api/admin/travel-types`),
          jsonFetch(`/api/admin/travel-themes`),
          jsonFetch(`/api/admin/destinations`),
        ]);
        if (!mounted) return;
        setOffer(o.data);
        setTypes((t.data as any[]).map((x: any) => ({ id: x.id, title: x.title, slug: x.slug })));
        setThemes((th.data as any[]).map((x: any) => ({ id: x.id, title: x.title, slug: x.slug })));
        setDestinations((d.data as any[]).map((x: any) => ({ id: x.id, title: x.title, slug: x.slug })));
        // load uploads list
        try {
          const up = await jsonFetch('/api/admin/uploads');
          setUploads(up.data || []);
        } catch {}
      } catch (e: any) {
        if (mounted) setError(e.message || 'Erreur chargement');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [params]);

  const canSave = useMemo(() => !!offer?.title && !!offer?.slug, [offer]);

  async function save() {
    if (!offer || !id) return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      console.log('Données à sauvegarder:', offer);
      const response = await jsonFetch(`/api/admin/offers/${id}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      });
      console.log('Réponse API:', response);
      setStatus('Offre enregistrée avec succès');
    } catch (e: any) {
      console.error('Erreur sauvegarde:', e);
      setError(e.message || 'Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  function toggleId(arr: number[], id: number): number[] {
    return arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
  }

  async function refreshUploads() {
    try {
      const up = await jsonFetch('/api/admin/uploads');
      setUploads(up.data || []);
    } catch {}
  }

  async function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/uploads', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) throw new Error(data?.error || `Erreur upload (${res.status})`);
      await refreshUploads();
      if (data.url && offer) {
        setOffer({ ...offer, image_url: data.url });
      }
      setStatus('Image téléversée');
    } catch (err: any) {
      setError(err.message || 'Erreur upload');
    } finally {
      setUploading(false);
      // reset input
      e.target.value = '';
    }
  }

  if (loading) return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center gap-2 text-sm text-neutral-600"><Spinner /> Chargement…</div>
    </div>
  );
  if (error) return (
    <div className="mx-auto max-w-6xl p-6">
      <p className="text-sm text-red-600">{error}</p>
    </div>
  );
  if (!offer) return null;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Modifier l'offre</h1>
        <div className="ml-auto">
          <Link
            href="/admin/offers"
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-300 h-10 px-4 text-sm"
          >
            ← Retour
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <label className="text-sm">
                Titre
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => setOffer({ ...(offer as OfferData), title: e.target.value })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                Slug
                <input
                  type="text"
                  value={offer.slug}
                  onChange={(e) => setOffer({ ...(offer as OfferData), slug: e.target.value })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                Résumé
                <textarea
                  value={offer.summary || ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), summary: e.target.value })}
                  className="mt-1 w-full min-h-[80px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                Description
                <textarea
                  value={offer.description || ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), description: e.target.value })}
                  className="mt-1 w-full min-h-[140px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image principale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <label className="text-sm">
                URL de l'image
                <input
                  type="text"
                  value={offer.image_url || ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), image_url: e.target.value })}
                  placeholder="/uploads/nom-de-fichier.jpg"
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                Sélectionner une image existante
                <select
                  value={offer.image_url || ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), image_url: e.target.value })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                >
                  <option value="">-- choisir --</option>
                  {uploads.map((f) => (
                    <option key={f.url} value={f.url}>{f.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                Importer une nouvelle image
                <input type="file" accept="image/*" onChange={onUploadFile} disabled={uploading} className="mt-1 block" />
              </label>
              {offer.image_url ? (
                <div className="mt-1">
                  <div className="text-xs text-neutral-600">Aperçu</div>
                  <img src={offer.image_url} alt="aperçu" className="mt-1 max-w-full rounded-md border border-neutral-200" />
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut et prix</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!offer.is_active}
                onChange={(e) => setOffer({ ...(offer as OfferData), is_active: e.target.checked ? 1 : 0 })}
                className="h-4 w-4"
              />
              Actif
            </label>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr,160px]">
              <label className="text-sm">
                Prix
                <input
                  type="number"
                  value={offer.price ?? ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), price: e.target.value === '' ? null : Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                Devise
                <input
                  type="text"
                  value={offer.price_currency || 'EUR'}
                  onChange={(e) => setOffer({ ...(offer as OfferData), price_currency: e.target.value })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="text-sm">
                Durée (jours)
                <input
                  type="number"
                  value={offer.duration_days ?? ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), duration_days: e.target.value === '' ? null : Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                Durée (nuits)
                <input
                  type="number"
                  value={offer.duration_nights ?? ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), duration_nights: e.target.value === '' ? null : Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {types.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={offer.typeIds.includes(t.id)}
                    onChange={() => setOffer({ ...(offer as OfferData), typeIds: toggleId(offer.typeIds, t.id) })}
                    className="h-4 w-4"
                  />
                  {t.title}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thèmes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {themes.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={offer.themeIds.includes(t.id)}
                    onChange={() => setOffer({ ...(offer as OfferData), themeIds: toggleId(offer.themeIds, t.id) })}
                    className="h-4 w-4"
                  />
                  {t.title}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {destinations.map((d) => (
                <label key={d.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={offer.destinationIds.includes(d.id)}
                    onChange={() => setOffer({ ...(offer as OfferData), destinationIds: toggleId(offer.destinationIds, d.id) })}
                    className="h-4 w-4"
                  />
                  {d.title}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dates de départ disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="text-sm text-neutral-600">
                Gérez les dates de départ disponibles pour cette offre. 
                <span className="font-medium text-orange-600">N&apos;oubliez pas de cliquer sur &quot;Enregistrer&quot; en bas pour sauvegarder vos modifications.</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  id="new-date-input"
                  min={new Date().toISOString().split('T')[0]}
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
                <Button
                  onClick={() => {
                    const input = document.getElementById('new-date-input') as HTMLInputElement;
                    if (input.value) {
                      if (offer.available_dates.includes(input.value)) {
                        setError('Cette date existe déjà');
                        return;
                      }
                      const newDates = [...offer.available_dates, input.value].sort();
                      setOffer({ 
                        ...(offer as OfferData), 
                        available_dates: newDates
                      });
                      input.value = '';
                      setStatus('Date ajoutée - cliquez sur Enregistrer pour sauvegarder');
                    }
                  }}
                  className="px-4 py-2 text-sm"
                >
                  Ajouter
                </Button>
              </div>
              <div className="grid gap-2">
                {offer.available_dates.length > 0 ? (
                  offer.available_dates.map((date, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                      <span className="text-sm">{new Date(date).toLocaleDateString('fr-FR')}</span>
                      <button
                        onClick={() => {
                          const updatedDates = offer.available_dates.filter((_, i) => i !== index);
                          setOffer({ 
                            ...(offer as OfferData), 
                            available_dates: updatedDates
                          });
                          setStatus('Date supprimée - cliquez sur Enregistrer pour sauvegarder');
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-500 italic">Aucune date de départ configurée</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 bg-yellow-500">
          <Button onClick={save} disabled={!canSave || saving}>
            {saving ? (
              <span className="inline-flex items-center gap-2"><Spinner size={16} /> Enregistrement…</span>
            ) : (
              'Enregistrer'
            )}
          </Button>
          {status && <span className="text-sm text-neutral-700">{status}</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </div>
    </div>
  );
}
