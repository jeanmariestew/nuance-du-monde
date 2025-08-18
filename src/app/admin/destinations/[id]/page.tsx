"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EditDestinationPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/destinations/${id}`, { credentials: 'include' });
        const json = await res.json();
        if (mounted && json.success && json.data) {
          setTitle(json.data.title || "");
          setSlug(json.data.slug || "");
          setDescription(json.data.description || "");
          setIsActive(!!json.data.is_active);
        } else if (mounted) {
          setError(json.error || 'Erreur de chargement');
        }
      } catch {
        if (mounted) setError('Erreur de chargement');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null);
    const res = await fetch(`/api/admin/destinations/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, is_active: isActive ? 1 : 0, description }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      window.location.href = '/admin/destinations';
    } else {
      setError(json.error || 'Erreur lors de la sauvegarde');
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: 24 }}>
      <h1>Modifier la destination</h1>
      <p><Link href="/admin/destinations">← Retour</Link></p>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <label>
            <div>Titre</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%' }} />
          </label>
          <label>
            <div>Slug</div>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} required style={{ width: '100%' }} />
          </label>
          <label>
            <div>Description</div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={{ width: '100%' }} />
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Actif
          </label>
          {error && <p style={{ color: 'crimson' }}>{error}</p>}
          <button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </form>
      )}
    </div>
  );
}
