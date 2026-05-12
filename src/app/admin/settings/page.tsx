"use client";
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import { adminApi } from '@/lib/axios';
import Spinner from '@/components/ui/Spinner';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [maintenance, setMaintenance] = useState(false);
  const [proVideoUrl, setProVideoUrl] = useState('');
  const [particulierVideoUrl, setParticulierVideoUrl] = useState('');
  const [facebookGroupUrl, setFacebookGroupUrl] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await adminApi.get('/settings');
        const data = res.data;
        if (mounted && data.success) {
          setMaintenance(String(data.data?.maintenance_mode || 'FALSE').toUpperCase() === 'TRUE');
          setProVideoUrl(data.data?.pro_video_url || '');
          setParticulierVideoUrl(data.data?.particulier_video_url || '');
          setFacebookGroupUrl(data.data?.facebook_group_url || '');
        }
      } catch {}
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await adminApi.post('/settings', {
        maintenance_mode: maintenance ? 'TRUE' : 'FALSE',
        pro_video_url: proVideoUrl.trim(),
        particulier_video_url: particulierVideoUrl.trim(),
        facebook_group_url: facebookGroupUrl.trim(),
      });
      const data = res.data;
      if (data.success) setStatus('Paramètres enregistrés');
      else setStatus(data.error || 'Erreur lors de la sauvegarde');
    } catch (e: any) {
      setStatus(e.message || 'Erreur réseau');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Paramètres</h1>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-neutral-600"><Spinner /> Chargement…</div>
      ) : (
        <>
          {/* Général */}
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
            </CardContent>
          </Card>

          {/* Vidéos */}
          <Card>
            <CardHeader>
              <CardTitle>Vidéos d&apos;accueil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Collez un lien YouTube, Vimeo ou une URL directe de vidéo. Laissez vide pour ne pas afficher de vidéo.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vidéo agents de voyage
                  <span className="ml-1 text-gray-400 font-normal">(espace pro + lightbox home)</span>
                </label>
                <input
                  type="url"
                  value={proVideoUrl}
                  onChange={(e) => setProVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {proVideoUrl && (
                  <p className="text-xs text-green-600 mt-1">✓ URL enregistrée</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vidéo particuliers
                  <span className="ml-1 text-gray-400 font-normal">(lightbox home particuliers)</span>
                </label>
                <input
                  type="url"
                  value={particulierVideoUrl}
                  onChange={(e) => setParticulierVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {particulierVideoUrl && (
                  <p className="text-xs text-green-600 mt-1">✓ URL enregistrée</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Groupes Facebook */}
          <Card>
            <CardHeader>
              <CardTitle>Groupes Facebook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lien groupe Facebook agents de voyage
                  <span className="ml-1 text-gray-400 font-normal">(espace pro section groupes)</span>
                </label>
                <input
                  type="url"
                  value={facebookGroupUrl}
                  onChange={(e) => setFacebookGroupUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="https://www.facebook.com/groups/..."
                />
                {facebookGroupUrl && (
                  <p className="text-xs text-green-600 mt-1">✓ URL enregistrée</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sauvegarde */}
          <Card>
            <CardContent className="pt-4">
              {status && (
                <p className={`mb-3 text-sm ${status.includes('Erreur') ? 'text-red-600' : 'text-green-600'}`}>
                  {status}
                </p>
              )}
              <Button onClick={save} disabled={saving}>
                {saving ? (
                  <span className="inline-flex items-center gap-2"><Spinner /> Enregistrement…</span>
                ) : (
                  'Enregistrer les paramètres'
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
