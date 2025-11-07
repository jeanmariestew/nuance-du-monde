"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageInput from '@/components/admin/ImageInput';

export default function EditTravelThemePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    image_url: "",
    banner_image_url: "",
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
        const res = await fetch(`/api/admin/travel-themes/${id}`, { credentials: 'include' });
        const json = await res.json();
        if (json.success) {
          const data = json.data;
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            description: data.description || "",
            short_description: data.short_description || "",
            image_url: data.image_url || "",
            banner_image_url: data.banner_image_url || "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
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
      const res = await fetch(`/api/admin/travel-themes/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          is_active: formData.is_active ? 1 : 0
        }),
      });
      
      const json = await res.json();
      
      if (json.success) {
        router.push('/admin/travel-themes');
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
      <h1>Modifier le thème</h1>
      <p><Link href="/admin/travel-themes">← Retour</Link></p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">Description courte</label>
          <input
            id="short_description"
            name="short_description"
            type="text"
            value={formData.short_description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-500">Une courte description pour l&apos;affichage dans les cartes</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description complète</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <ImageInput
          label="Image principale"
          value={formData.image_url}
          onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
          disabled={saving}
          previewClassName="h-40 w-40"
          mode="both"
        />

        <ImageInput
          label="Image de fond"
          value={formData.banner_image_url}
          onChange={(url) => setFormData(prev => ({ ...prev, banner_image_url: url }))}
          disabled={saving}
          previewClassName="h-40 w-60"
          mode="both"
          placeholder="Choisir une image de fond"
        />

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
          <p className="mt-1 text-xs text-gray-500">Plus le nombre est bas, plus l&apos;élément apparaîtra en haut</p>
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
            onClick={() => router.push('/admin/travel-themes')}
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
