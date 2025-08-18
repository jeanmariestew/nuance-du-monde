"use client";
import { useEffect, useState } from 'react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/settings', { credentials: 'include' });
        const data = await res.json();
        if (mounted && res.ok && data.success) {
          setMaintenance(String(data.data?.maintenance_mode || 'FALSE').toUpperCase() === 'TRUE');
        }
      } catch {}
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ maintenance_mode: maintenance ? 'TRUE' : 'FALSE' }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) setStatus('Paramètres enregistrés');
      else setStatus(data.error || 'Erreur lors de la sauvegarde');
    } catch (e: any) {
      setStatus(e.message || 'Erreur réseau');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: 24 }}>
      <h1>Paramètres</h1>
      <p><a href="/admin">← Retour tableau de bord</a></p>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
            />
            Mode maintenance
          </label>
          <div style={{ marginTop: 16 }}>
            <button onClick={save} disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
          {status && <p style={{ marginTop: 12 }}>{status}</p>}
        </div>
      )}
    </div>
  );
}
