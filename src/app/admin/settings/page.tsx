"use client";
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

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
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Paramètres</h1>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-neutral-600"><Spinner /> Chargement…</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Général</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={maintenance}
                onChange={(e) => setMaintenance(e.target.checked)}
                className="size-4"
              />
              Mode maintenance
            </label>
            {status && <p className="mt-3 text-sm text-neutral-700">{status}</p>}
          </CardContent>
          <CardFooter>
            <Button onClick={save} disabled={saving}>
              {saving ? (
                <span className="inline-flex items-center gap-2"><Spinner size={16} /> Enregistrement…</span>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
