"use client";
import { useState } from 'react';

async function post(url: string) {
  const res = await fetch(url, { method: 'POST' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Action échouée');
  }
  return data;
}

export default function AdminDashboard() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const run = async (name: string, url: string) => {
    setLoading(name);
    setStatus(null);
    try {
      await post(url);
      setStatus(`${name} OK`);
    } catch (e: any) {
      setStatus(`${name} erreur: ${e.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '40px auto', padding: 24 }}>
      <h1>Backoffice — Tableau de bord</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button onClick={() => run('Migration', '/api/admin/migrate')} disabled={!!loading}>
          {loading === 'Migration' ? 'Migration…' : 'Exécuter Migration'}
        </button>
        <button onClick={() => run('Seed', '/api/admin/seed')} disabled={!!loading}>
          {loading === 'Seed' ? 'Seed…' : 'Exécuter Seed'}
        </button>
      </div>
      {status && <p>{status}</p>}

      <hr style={{ margin: '24px 0' }} />

      <nav style={{ display: 'flex', gap: 12 }}>
        <a href="/admin/offers">Gérer les offres</a>
        <a href="/admin/travel-types">Types de voyage</a>
        <a href="/admin/travel-themes">Thèmes</a>
        <a href="/admin/destinations">Destinations</a>
        <a href="/admin/settings">Paramètres</a>
      </nav>
    </div>
  );
}
