'use client';

import { useState, useEffect } from 'react';
import { PageMetadata } from '@/types';

export default function MetadataManagementPage() {
  const [metadata, setMetadata] = useState<PageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PageMetadata | null>(null);
  const [showForm, setShowForm] = useState(false);

  const pageTypes = [
    { value: 'home', label: 'Page d\'accueil' },
    { value: 'destinations_list', label: 'Liste des destinations' },
    { value: 'destination', label: 'Destination individuelle' },
    { value: 'themes_list', label: 'Liste des thèmes' },
    { value: 'theme', label: 'Thème individuel' },
    { value: 'types_list', label: 'Liste des types' },
    { value: 'travel-type', label: 'Type individuel' },
    { value: 'offers_list', label: 'Liste des offres' },
    { value: 'offer', label: 'Offre individuelle' },
    { value: 'contact', label: 'Contact' },
    { value: 'about', label: 'À propos' },
    { value: 'demander_devis', label: 'Demander un devis' }
  ];

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const response = await fetch('/api/admin/metadata');
      const data = await response.json();
      
      if (data.success) {
        setMetadata(data.data);
      } else {
        setError(data.error || 'Erreur lors du chargement des métadonnées');
      }
    } catch (err) {
      setError('Erreur lors du chargement des métadonnées');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: PageMetadata) => {
    try {
      const url = editingItem 
        ? `/api/admin/metadata/${editingItem.id}`
        : '/api/admin/metadata';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchMetadata();
        setEditingItem(null);
        setShowForm(false);
      } else {
        setError(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ces métadonnées ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/metadata/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchMetadata();
      } else {
        setError(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des métadonnées SEO</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter des métadonnées
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <MetadataForm
          initialData={editingItem}
          pageTypes={pageTypes}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type de page
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metadata.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {pageTypes.find(pt => pt.value === item.page_type)?.label || item.page_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.page_slug || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {item.meta_title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                  {item.meta_description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface MetadataFormProps {
  initialData: PageMetadata | null;
  pageTypes: { value: string; label: string }[];
  onSubmit: (data: PageMetadata) => void;
  onCancel: () => void;
}

function MetadataForm({ initialData, pageTypes, onSubmit, onCancel }: MetadataFormProps) {
  const [formData, setFormData] = useState<PageMetadata>({
    page_type: initialData?.page_type || '',
    page_slug: initialData?.page_slug || '',
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || '',
    meta_keywords: initialData?.meta_keywords || '',
    og_title: initialData?.og_title || '',
    og_description: initialData?.og_description || '',
    og_image: initialData?.og_image || '',
    og_type: initialData?.og_type || 'website',
    twitter_card: initialData?.twitter_card || 'summary_large_image',
    twitter_title: initialData?.twitter_title || '',
    twitter_description: initialData?.twitter_description || '',
    twitter_image: initialData?.twitter_image || '',
    canonical_url: initialData?.canonical_url || '',
    robots: initialData?.robots || 'index,follow',
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? 'Modifier les métadonnées' : 'Ajouter des métadonnées'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de page *
            </label>
            <select
              value={formData.page_type}
              onChange={(e) => setFormData({ ...formData, page_type: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un type</option>
              {pageTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug de page (optionnel)
            </label>
            <input
              type="text"
              value={formData.page_slug || ''}
              onChange={(e) => setFormData({ ...formData, page_slug: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Pour des pages spécifiques"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre SEO *
          </label>
          <input
            type="text"
            value={formData.meta_title}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength={255}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.meta_title.length}/255 caractères
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description SEO *
          </label>
          <textarea
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
            maxLength={320}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.meta_description.length}/320 caractères
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mots-clés SEO
          </label>
          <input
            type="text"
            value={formData.meta_keywords || ''}
            onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="mot1, mot2, mot3"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Open Graph (Facebook, LinkedIn)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre OG
              </label>
              <input
                type="text"
                value={formData.og_title || ''}
                onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image OG (URL)
              </label>
              <input
                type="url"
                value={formData.og_image || ''}
                onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description OG
            </label>
            <textarea
              value={formData.og_description || ''}
              onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Twitter Card</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de carte Twitter
              </label>
              <select
                value={formData.twitter_card || 'summary_large_image'}
                onChange={(e) => setFormData({ ...formData, twitter_card: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Twitter (URL)
              </label>
              <input
                type="url"
                value={formData.twitter_image || ''}
                onChange={(e) => setFormData({ ...formData, twitter_image: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL canonique
              </label>
              <input
                type="url"
                value={formData.canonical_url || ''}
                onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Robots
              </label>
              <select
                value={formData.robots || 'index,follow'}
                onChange={(e) => setFormData({ ...formData, robots: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="index,follow">Index, Follow</option>
                <option value="noindex,nofollow">No Index, No Follow</option>
                <option value="index,nofollow">Index, No Follow</option>
                <option value="noindex,follow">No Index, Follow</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Métadonnées actives
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {initialData ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}
