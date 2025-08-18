"use client";
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json());

type AdminDestination = {
  id: number;
  title: string;
  slug: string;
  is_active: 0 | 1 | boolean;
  offer_count?: number;
};

export default function AdminDestinationsPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/destinations', fetcher);
  const onDelete = async (id: number) => {
    if (!confirm('Supprimer cette destination ?')) return;
    const res = await fetch(`/api/admin/destinations/${id}`, { method: 'DELETE', credentials: 'include' });
    const json = await res.json();
    if (json.success) mutate();
    else alert(json.error || 'Erreur de suppression');
  };
  return (
    <div style={{ maxWidth: 960, margin: '24px auto', padding: 24 }}>
      <h1>Destinations</h1>
      <p style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <a href="/admin">← Retour tableau de bord</a>
        <a href="/admin/destinations/new" style={{ marginLeft: 'auto' }}>+ Nouvelle destination</a>
      </p>
      {isLoading && <p>Chargement…</p>}
      {error && <p style={{ color: 'crimson' }}>Erreur de chargement</p>}
      {data?.success && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Titre</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Slug</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Offres liées</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Actif</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((d: AdminDestination) => (
              <tr key={d.id}>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{d.title}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{d.slug}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{d.offer_count}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>{d.is_active ? 'Oui' : 'Non'}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
                  <Link href={`/admin/destinations/${d.id}`} aria-label="Modifier" title="Modifier" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </Link>
                  <button onClick={() => onDelete(d.id)} aria-label="Supprimer" title="Supprimer" style={{ background: 'none', border: '1px solid #eee', borderRadius: 4, padding: 6, cursor: 'pointer', color: 'crimson', display: 'inline-flex', alignItems: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
