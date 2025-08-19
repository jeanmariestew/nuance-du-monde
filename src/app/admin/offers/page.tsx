"use client";
import useSWR from 'swr';
import Link from 'next/link';
import { Table, THead, TBody, Tr, Th, Td } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Pencil, Trash2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((r) => r.json());

type AdminOffer = {
  id: number;
  title: string;
  slug: string;
  is_active: 0 | 1 | boolean;
  price?: number | null;
  price_currency?: string | null;
};

export default function AdminOffersPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/offers', fetcher);
  const onDelete = async (id: number) => {
    if (!confirm('Supprimer cette offre ?')) return;
    const res = await fetch(`/api/admin/offers/${id}`, { method: 'DELETE', credentials: 'include' });
    const json = await res.json();
    if (json.success) mutate();
    else alert(json.error || 'Erreur de suppression');
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Offres</h1>
        <div className="ml-auto">
          <Link href="/admin/offers/new" className="inline-flex">
            <Button>+ Nouvelle offre</Button>
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
              <Th>Prix</Th>
              <Th>Actions</Th>
            </Tr>
          </THead>
          <TBody>
            {data.data.map((o: AdminOffer) => (
              <Tr key={o.id}>
                <Td className="font-medium">{o.title}</Td>
                <Td>{o.slug}</Td>
                <Td>
                  {o.is_active ? (
                    <Badge variant="success">Oui</Badge>
                  ) : (
                    <Badge variant="muted">Non</Badge>
                  )}
                </Td>
                <Td>{o.price ? `${o.price} ${o.price_currency || 'EUR'}` : '-'}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/offers/${o.id}`} aria-label="Modifier" title="Modifier" className="inline-flex">
                      <Button variant="ghost" size="sm" iconLeft={<Pencil className="h-4 w-4" />}>
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(o.id)}
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
