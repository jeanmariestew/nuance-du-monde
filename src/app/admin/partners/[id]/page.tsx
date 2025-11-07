"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageInput from '@/components/admin/ImageInput';

export default function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    agency: "",
    image_url: "",
    website_url: "",
    sort_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/partners/${id}`, { credentials: 'include' });
        const json = await res.json();
        if (json.success) {
          const data = json.data;
          setFormData({
            name: data.name || "",
            agency: data.agency || "",
            image_url: data.logo_url || "",
            website_url: data.website_url || "",
            sort_order: data.sort_order || 0,
            is_active: data.is_active === 1
          });
        } else {
          setError(json.error || 'Erreur lors du chargement');
        }
      } catch {
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true); 
    setError(null);
    
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          agency: formData.agency,
          logo_url: formData.image_url,
          website_url: formData.website_url,
          sort_order: formData.sort_order,
          is_active: formData.is_active ? 1 : 0
        }),
      });
      
      const json = await res.json();
      
      if (json.success) {
        router.push('/admin/partners');
      } else {
        setError(json.error || 'Erreur lors de la mise à jour');
      }
    } catch {
      setError('Une erreur est survenue lors de la communication avec le serveur');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Chargement...</div>;

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: 24 }}>
      <h1>Modifier le partenaire</h1>
      <p><Link href="/admin/partners">← Retour</Link></p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-1">Agence *</label>
          <input
            id="agency"
            name="agency"
            type="text"
            value={formData.agency}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <ImageInput
          label="Photo du partenaire"
          value={formData.image_url}
          onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
          disabled={saving}
          previewClassName="h-24 w-24 rounded-full"
          mode="both"
          placeholder="Choisir une photo"
        />

        <div>
          <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
          <input
            id="website_url"
            name="website_url"
            type="url"
            placeholder="https://example.com"
            value={formData.website_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-1">Ordre d&apos;affichage</label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            min="0"
            value={formData.sort_order}
            onChange={handleChange}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-500">Plus le nombre est bas, plus l&apos;élément apparaîtra en premier</p>
        </div>

        <div className="flex items-center">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Actif
          </label>
        </div>

        {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/admin/partners')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Enregistrement...' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
}
