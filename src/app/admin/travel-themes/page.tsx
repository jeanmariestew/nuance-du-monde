"use client";
import useSWR from 'swr';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/axios';

const fetcher = (url: string) => adminApi.get(url).then((r) => r.data);

type TravelTheme = {
  id: number;
  title: string;
  slug: string;
  is_active: 0 | 1 | boolean;
};

export default function AdminTravelThemesPage() {
  const { data, error, isLoading, mutate } = useSWR('/travel-themes', fetcher);
  const onDelete = async (id: number) => {
    if (!confirm('Supprimer ce thème ?')) return;
    const res = await adminApi.delete(`/travel-themes/${id}`);
    const json = res.data;
    if (json.success) mutate();
    else alert(json.error || 'Erreur de suppression');
  };

  const columns: Column<TravelTheme>[] = [
    { key: 'title', label: 'Titre', sortable: true, render: (t) => <span className="font-medium">{t.title}</span> },
    { key: 'slug', label: 'Slug', sortable: true },
    {
      key: 'is_active',
      label: 'Actif',
      sortable: true,
      render: (t) => t.is_active ? <Badge variant="success">Oui</Badge> : <Badge variant="muted">Non</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (t) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/travel-themes/${t.id}`} aria-label="Modifier" title="Modifier" className="inline-flex">
            <Button variant="ghost" size="sm" iconLeft={<Pencil className="h-4 w-4" />}>
              <span className="sr-only">Modifier</span>
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(t.id)}
            aria-label="Supprimer"
            title="Supprimer"
            iconLeft={<Trash2 className="h-4 w-4" />}
          >
            <span className="sr-only">Supprimer</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Thèmes</h1>
        <div className="ml-auto">
          <Link href="/admin/travel-themes/new" className="inline-flex">
            <Button>+ Nouveau thème</Button>
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-neutral-600"><Spinner /> Chargement…</div>
      )}
      {error && (
        <p className="text-sm text-red-600">Erreur de chargement</p>
      )}

      {data?.success && (
        <DataTable
          data={data.data}
          columns={columns}
          searchKeys={['title', 'slug']}
          pageSize={10}
          getRowKey={(t) => t.id}
        />
      )}
    </div>
  );
}
