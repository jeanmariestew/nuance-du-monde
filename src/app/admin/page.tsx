"use client";
import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

async function post(url: string) {
  const res = await fetch(url, { method: 'POST', credentials: 'include' });
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
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        <p className="text-sm text-neutral-500">Actions d'administration rapides</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => run('Migration', '/api/admin/migrate')} disabled={!!loading}>
                {loading === 'Migration' && <Spinner className="mr-2" size={16} />}
                Exécuter Migration
              </Button>
              <Button variant="secondary" onClick={() => run('Seed', '/api/admin/seed')} disabled={!!loading}>
                {loading === 'Seed' && <Spinner className="mr-2" size={16} />}
                Exécuter Seed
              </Button>
            </div>
            {status && <p className="mt-3 text-sm text-neutral-600">{status}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation rapide</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="grid grid-cols-2 gap-2 text-sm">
              <Link className="px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200" href="/admin/offers">Gérer les offres</Link>
              <Link className="px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200" href="/admin/travel-types">Types de voyage</Link>
              <Link className="px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200" href="/admin/travel-themes">Thèmes</Link>
              <Link className="px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200" href="/admin/destinations">Destinations</Link>
              <Link className="px-3 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200" href="/admin/settings">Paramètres</Link>
            </nav>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
