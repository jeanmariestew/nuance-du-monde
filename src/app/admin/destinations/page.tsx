"use client";
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import DataTable, { Column } from '@/components/admin/DataTable';
import { Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/axios';

const fetcher = (url: string) => adminApi.get(url).then((r) => r.data);

type AdminDestination = {
  id: number;
  title: string;
  slug: string;
  continent?: string;
  is_active: 0 | 1 | boolean;
  offer_count?: number;
  banner_image_url?: string | null;
};

export default function AdminDestinationsPage() {
  const { data, error, isLoading, mutate } = useSWR('/destinations', fetcher);
  const onDelete = async (id: number) => {
    if (!confirm('Supprimer cette destination ?')) return;
    const res = await adminApi.delete(`/destinations/${id}`);
    const json = res.data;
    if (json.success) mutate();
    else alert(json.error || 'Erreur de suppression');
  };

  const columns: Column<AdminDestination>[] = [
    {
      key: 'banner_image_url',
      label: 'Image',
      render: (d) => (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          {d.banner_image_url ? (
            <Image src={d.banner_image_url} alt={d.title} fill className="object-cover" sizes="64px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Pas d&apos;image
            </div>
          )}
        </div>
      ),
    },
    { key: 'title', label: 'Titre', sortable: true, render: (d) => <span className="font-medium">{d.title}</span> },
    { key: 'slug', label: 'Slug', sortable: true },
    {
      key: 'continent',
      label: 'Continent',
      sortable: true,
      render: (d) => d.continent || <span className="text-gray-400">Non défini</span>,
    },
    { key: 'offer_count', label: 'Offres liées', sortable: true },
    {
      key: 'is_active',
      label: 'Actif',
      sortable: true,
      render: (d) => d.is_active ? <Badge variant="success">Oui</Badge> : <Badge variant="muted">Non</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (d) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/destinations/${d.id}`} aria-label="Modifier" title="Modifier" className="inline-flex">
            <Button variant="ghost" size="sm" iconLeft={<Pencil className="h-4 w-4" />}>
              <span className="sr-only">Modifier</span>
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(d.id)}
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
        <h1 className="text-2xl font-semibold">Destinations</h1>
        <div className="ml-auto">
          <Link href="/admin/destinations/new" className="inline-flex">
            <Button>+ Nouvelle destination</Button>
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
          searchKeys={['title', 'slug', 'continent']}
          pageSize={10}
          getRowKey={(d) => d.id}
        />
      )}
    </div>
  );
}
