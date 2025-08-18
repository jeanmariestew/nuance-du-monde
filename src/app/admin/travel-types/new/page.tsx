"use client";
import { useState } from 'react';

export default function NewTravelTypePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null);
    const res = await fetch('/api/admin/travel-types', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, is_active: isActive ? 1 : 0 }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      window.location.href = '/admin/travel-types';
    } else {
      setError(json.error || 'Erreur lors de la création');
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: 24 }}>
      <h1>Nouveau type de voyage</h1>
      <p><a href="/admin/travel-types">← Retour</a></p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          <div>Titre</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%' }} />
        </label>
        <label>
          <div>Slug</div>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required style={{ width: '100%' }} />
        </label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Actif
        </label>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Créer'}</button>
      </form>
    </div>
  );
}
