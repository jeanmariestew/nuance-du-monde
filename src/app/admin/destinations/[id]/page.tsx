"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

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
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Modifier la destination</h1>
        <div className="ml-auto">
          <Link
            href="/admin/destinations"
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-300 h-10 px-4 text-sm"
          >
            ← Retour
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="p-4 text-sm text-neutral-600 inline-flex items-center gap-2"><Spinner /> Chargement…</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-3">
              <label className="text-sm">
                <div>Titre</div>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                <div>Slug</div>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                <div>Description</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full min-h-[100px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4" />
                Actif
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <span className="inline-flex items-center gap-2"><Spinner size={16} /> Enregistrement…</span>
                  ) : (
                    'Enregistrer'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
