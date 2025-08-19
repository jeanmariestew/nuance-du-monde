"use client";
import useSWR from 'swr';
import Link from 'next/link';
import { Table, THead, TBody, Tr, Th, Td } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Pencil, Trash2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json());

type TravelType = {
  id: number;
  title: string;
  slug: string;
  is_active: 0 | 1 | boolean;
};

export default function AdminTravelTypesPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/travel-types', fetcher);
  const onDelete = async (id: number) => {
    if (!confirm('Supprimer ce type de voyage ?')) return;
    const res = await fetch(`/api/admin/travel-types/${id}`, { method: 'DELETE', credentials: 'include' });
    const json = await res.json();
    if (json.success) mutate();
    else alert(json.error || 'Erreur de suppression');
  };
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Types de voyage</h1>
        <div className="ml-auto">
          <Link href="/admin/travel-types/new" className="inline-flex">
            <Button>+ Nouveau type</Button>
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
        <Table>
          <THead>
            <Tr>
              <Th>Titre</Th>
              <Th>Slug</Th>
              <Th>Actif</Th>
              <Th>Actions</Th>
            </Tr>
          </THead>
          <TBody>
            {data.data.map((t: TravelType) => (
              <Tr key={t.id}>
                <Td className="font-medium">{t.title}</Td>
                <Td>{t.slug}</Td>
                <Td>
                  {t.is_active ? <Badge variant="success">Oui</Badge> : <Badge variant="muted">Non</Badge>}
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/travel-types/${t.id}`} aria-label="Modifier" title="Modifier" className="inline-flex">
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
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
