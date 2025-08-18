"use client";
import { useEffect, useMemo, useState } from 'react';

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
  typeIds: number[];
  themeIds: number[];
  destinationIds: number[];
};

export default function AdminOfferEditPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
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
        const [o, t, th, d] = await Promise.all([
          jsonFetch(`/api/admin/offers/${id}`),
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
  }, [id]);

  const canSave = useMemo(() => !!offer?.title && !!offer?.slug, [offer]);

  async function save() {
    if (!offer) return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      await jsonFetch(`/api/admin/offers/${id}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      });
      setStatus('Offre enregistrée');
    } catch (e: any) {
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

  if (loading) return <div style={{ maxWidth: 960, margin: '24px auto', padding: 24 }}><p>Chargement…</p></div>;
  if (error) return <div style={{ maxWidth: 960, margin: '24px auto', padding: 24 }}><p style={{ color: 'crimson' }}>{error}</p></div>;
  if (!offer) return null;

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', padding: 24 }}>
      <h1>Modifier l'offre</h1>
      <p style={{ display: 'flex', gap: 12 }}>
        <a href="/admin/offers">← Retour</a>
      </p>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <label>
          Titre
          <input
            type="text"
            value={offer.title}
            onChange={(e) => setOffer({ ...(offer as OfferData), title: e.target.value })}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <label>
          Slug
          <input
            type="text"
            value={offer.slug}
            onChange={(e) => setOffer({ ...(offer as OfferData), slug: e.target.value })}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <label>
          Résumé
          <textarea
            value={offer.summary || ''}
            onChange={(e) => setOffer({ ...(offer as OfferData), summary: e.target.value })}
            style={{ width: '100%', padding: 8, marginTop: 4, minHeight: 80 }}
          />
        </label>
        <label>
          Description
          <textarea
            value={offer.description || ''}
            onChange={(e) => setOffer({ ...(offer as OfferData), description: e.target.value })}
            style={{ width: '100%', padding: 8, marginTop: 4, minHeight: 140 }}
          />
        </label>
        <div style={{ border: '1px solid #eee', padding: 12 }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Image principale</div>
          <div style={{ display: 'grid', gap: 8 }}>
            <label>
              URL de l'image
              <input
                type="text"
                value={offer.image_url || ''}
                onChange={(e) => setOffer({ ...(offer as OfferData), image_url: e.target.value })}
                placeholder="/uploads/nom-de-fichier.jpg"
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>
            <label>
              Sélectionner une image existante
              <select
                value={offer.image_url || ''}
                onChange={(e) => setOffer({ ...(offer as OfferData), image_url: e.target.value })}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              >
                <option value="">-- choisir --</option>
                {uploads.map((f) => (
                  <option key={f.url} value={f.url}>{f.name}</option>
                ))}
              </select>
            </label>
            <label>
              Importer une nouvelle image
              <input type="file" accept="image/*" onChange={onUploadFile} disabled={uploading} style={{ display: 'block', marginTop: 4 }} />
            </label>
            {offer.image_url ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Aperçu</div>
                <img src={offer.image_url} alt="aperçu" style={{ maxWidth: '100%', border: '1px solid #eee' }} />
              </div>
            ) : null}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={!!offer.is_active}
            onChange={(e) => setOffer({ ...(offer as OfferData), is_active: e.target.checked ? 1 : 0 })}
          />
          Actif
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ flex: 1 }}>
            Prix
            <input
              type="number"
              value={offer.price ?? ''}
              onChange={(e) => setOffer({ ...(offer as OfferData), price: e.target.value === '' ? null : Number(e.target.value) })}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
          <label style={{ width: 160 }}>
            Devise
            <input
              type="text"
              value={offer.price_currency || 'EUR'}
              onChange={(e) => setOffer({ ...(offer as OfferData), price_currency: e.target.value })}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </div>

        <fieldset style={{ border: '1px solid #ddd', padding: 12 }}>
          <legend>Types</legend>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {types.map((t) => (
              <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={offer.typeIds.includes(t.id)}
                  onChange={() => setOffer({ ...(offer as OfferData), typeIds: toggleId(offer.typeIds, t.id) })}
                />
                {t.title}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 12 }}>
          <legend>Thèmes</legend>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {themes.map((t) => (
              <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={offer.themeIds.includes(t.id)}
                  onChange={() => setOffer({ ...(offer as OfferData), themeIds: toggleId(offer.themeIds, t.id) })}
                />
                {t.title}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 12 }}>
          <legend>Destinations</legend>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {destinations.map((d) => (
              <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={offer.destinationIds.includes(d.id)}
                  onChange={() => setOffer({ ...(offer as OfferData), destinationIds: toggleId(offer.destinationIds, d.id) })}
                />
                {d.title}
              </label>
            ))}
          </div>
        </fieldset>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={save} disabled={!canSave || saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
          {status && <span>{status}</span>}
          {error && <span style={{ color: 'crimson' }}>{error}</span>}
        </div>
      </div>
    </div>
  );
}
