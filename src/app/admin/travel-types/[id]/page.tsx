"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import ImageInput from "@/components/admin/ImageInput";
import { adminApi } from '@/lib/axios';

export default function EditTravelTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    image_url: "",
    sort_order: 0,
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Résoudre les paramètres async de Next.js 15
  useEffect(() => {
    params.then((resolvedParams) => {
      setId(Number(resolvedParams.id));
    });
  }, [params]);

  useEffect(() => {
    if (id === null) return; // Attendre que l'id soit résolu
    
    let mounted = true;
    (async () => {
      try {
        const res = await adminApi.get(`/travel-types/${id}`);
        const json = res.data;
        if (mounted && json.success && json.data) {
          setFormData({
            title: json.data.title || "",
            slug: json.data.slug || "",
            description: json.data.description || "",
            short_description: json.data.short_description || "",
            image_url: json.data.image_url || "",
            sort_order: json.data.sort_order || 0,
            is_active: !!json.data.is_active,
          });
        } else if (mounted) {
          setError(json.error || "Erreur de chargement");
        }
      } catch (e) {
        console.log(e);
        if (mounted) setError("Erreur de chargement");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await adminApi.put(`/travel-types/${id}`, {
        ...formData,
        is_active: formData.is_active ? 1 : 0,
      });
      const json = res.data;

      if (json.success) {
        router.push("/admin/travel-types");
      } else {
        setError(json.error || "Erreur lors de la sauvegarde");
      }
    } catch (err) {
      console.log(err);
      setError(
        "Une erreur est survenue lors de la communication avec le serveur"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Modifier le type de voyage</h1>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => router.push("/admin/travel-types")}
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-300 h-10 px-4 text-sm"
          >
            ← Retour
          </button>
        </div>
      </div>
      {loading ? (
        <div className="p-4 text-sm text-neutral-600 inline-flex items-center gap-2">
          <Spinner /> Chargement…
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Titre *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Slug *
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="short_description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description courte
                </label>
                <input
                  id="short_description"
                  name="short_description"
                  type="text"
                  value={formData.short_description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Une courte description pour l&apos;affichage dans les cartes
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description complète
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <ImageInput
                label="Image"
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                disabled={saving}
                previewClassName="h-40 w-40"
                mode="both"
              />

              <div>
                <label
                  htmlFor="sort_order"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ordre d&apos;affichage
                </label>
                <input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={handleChange}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Plus le nombre est bas, plus l&apos;élément apparaîtra en haut
                </p>
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
                <label
                  htmlFor="is_active"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Actif
                </label>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/admin/travel-types")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
