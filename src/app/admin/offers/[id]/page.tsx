"use client";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import OfferImagesManager from '@/components/admin/OfferImagesManager';
import CoordinatesEditor from '@/components/admin/CoordinatesEditor';
import ImageInput from '@/components/admin/ImageInput';
import ItineraryEditor from '@/components/admin/ItineraryEditor';
import DayOptionsEditor, { DayOption } from '@/components/admin/DayOptionsEditor';
import ExtensionEditor, { OfferExtension } from '@/components/admin/ExtensionEditor';
import HotelEditor, { OfferHotel } from '@/components/admin/HotelEditor';
import { adminApi } from '@/lib/axios';

// Normalise une date (string ISO ou "YYYY-MM-DD") pour la valeur d'un <input type="date">
function toInputDate(value?: string | null): string {
  return value ? value.slice(0, 10) : '';
}

type RefItem = { id: number; title: string; slug: string };

type OfferImage = {
  id?: number;
  image_url: string;
  image_type: 'main' | 'gallery' | 'banner';
  alt_text: string;
  sort_order: number;
};

type OfferData = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  images: OfferImage[];
  is_active: 0 | 1;
  is_pro: 0 | 1;
  price: number | null;
  price_currency: string | null;
  promotional_price: number | null;
  promotional_price_currency: string | null;
  promotion_start_date: string | null;
  promotion_end_date: string | null;
  promotion_description: string | null;
  price_includes: string | null;
  price_excludes: string | null;
  label: string | null;
  programme_link: string | null;
  coordinates: Array<{ name: string; lat: number; lng: number }>;
  map_center: { lat: number; lng: number; zoom: number } | null;
  map_image: string | null;
  duration_days: number | null;
  duration_nights: number | null;
  available_dates: string[];
  dates?: { id?: number; departure_date: string; return_date?: string | null; price?: number | null; price_currency?: string | null; price_note?: string | null }[];
  typeIds: number[];
  themeIds: number[];
  destinationIds: number[];
};

export default function AdminOfferEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[] | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [editingDateIndex, setEditingDateIndex] = useState<number | null>(null);
  const [dateDraft, setDateDraft] = useState<{ departure_date: string; return_date: string; price: string; price_currency: string; price_note: string }>({
    departure_date: '', return_date: '', price: '', price_currency: 'CAD', price_note: '',
  });

  const [offer, setOffer] = useState<OfferData | null>(null);
  const [originalOffer, setOriginalOffer] = useState<OfferData | null>(null);
  const [types, setTypes] = useState<RefItem[]>([]);
  const [themes, setThemes] = useState<RefItem[]>([]);
  const [destinations, setDestinations] = useState<RefItem[]>([]);
  const [_uploads, setUploads] = useState<{ name: string; url: string }[]>([]);
  const [dayOptions, setDayOptions] = useState<DayOption[]>([]);
  const [originalDayOptions, setOriginalDayOptions] = useState<DayOption[]>([]);
  const [extensions, setExtensions] = useState<OfferExtension[]>([]);
  const [originalExtensions, setOriginalExtensions] = useState<OfferExtension[]>([]);
  const [hotels, setHotels] = useState<OfferHotel[]>([]);
  const [originalHotels, setOriginalHotels] = useState<OfferHotel[]>([]);
  // const [_uploading, setUploading] = useState(false);

  // Détecter si des modifications ont été apportées
  const hasChanges = useMemo(() => {
    if (!offer || !originalOffer) return false;
    const offerChanged = JSON.stringify(offer) !== JSON.stringify(originalOffer);
    const optionsChanged = JSON.stringify(dayOptions) !== JSON.stringify(originalDayOptions);
    const extensionsChanged = JSON.stringify(extensions) !== JSON.stringify(originalExtensions);
    const hotelsChanged = JSON.stringify(hotels) !== JSON.stringify(originalHotels);
    return offerChanged || optionsChanged || extensionsChanged || hotelsChanged;
  }, [offer, originalOffer, dayOptions, originalDayOptions, extensions, originalExtensions, hotels, originalHotels]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resolvedParams = await params;
        const resolvedId = Number(resolvedParams.id);
        setId(resolvedId);
        
        if (!resolvedId) {
          if (mounted) setError('ID invalide');
          return;
        }
        
        const [o, t, th, d, opts, exts, hts] = await Promise.all([
          adminApi.get(`/offers/${resolvedId}`).then(res => res.data),
          adminApi.get(`/travel-types`).then(res => res.data),
          adminApi.get(`/travel-themes`).then(res => res.data),
          adminApi.get(`/destinations`).then(res => res.data),
          adminApi.get(`/offers/${resolvedId}/options`).then(res => res.data).catch(() => ({ data: [] })),
          adminApi.get(`/offers/${resolvedId}/extensions`).then(res => res.data).catch(() => ({ data: [] })),
          adminApi.get(`/offers/${resolvedId}/hotels`).then(res => res.data).catch(() => ({ data: [] })),
        ]);
        if (!mounted) return;
        setOffer(o.data);
        setOriginalOffer(JSON.parse(JSON.stringify(o.data)));
        setDayOptions(opts.data || []);
        setOriginalDayOptions(JSON.parse(JSON.stringify(opts.data || [])));
        setExtensions(exts.data || []);
        setOriginalExtensions(JSON.parse(JSON.stringify(exts.data || [])));
        setHotels(hts.data || []);
        setOriginalHotels(JSON.parse(JSON.stringify(hts.data || [])));
        setTypes((t.data as any[]).map((x: any) => ({ id: x.id, title: x.title, slug: x.slug })));
        setThemes((th.data as any[]).map((x: any) => ({ id: x.id, title: x.title, slug: x.slug })));
        setDestinations((d.data as any[]).map((x: any) => ({ id: x.id, title: x.title, slug: x.slug })));
        // load uploads list
        try {
          const up = await adminApi.get('/uploads').then(res => res.data);
          setUploads(up.data || []);
        } catch {}
      } catch (e: any) {
        if (mounted) setError(e.message || 'Erreur chargement');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [params]);

  const canSave = useMemo(() => !!offer?.title && !!offer?.slug, [offer]);

  async function save() {
    if (!offer || !id) return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      // Formater les dates pour MySQL (YYYY-MM-DD uniquement)
      const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        // Si c'est déjà au format YYYY-MM-DD, le garder tel quel
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        // Sinon, extraire juste la partie date d'un timestamp ISO
        return dateStr.split('T')[0];
      };

      const dataToSave = {
        ...offer,
        promotion_start_date: formatDate(offer.promotion_start_date),
        promotion_end_date: formatDate(offer.promotion_end_date),
      };

      console.log('Données à sauvegarder:', dataToSave);
      const response = await adminApi.put(`/offers/${id}`, dataToSave).then(res => res.data);
      console.log('Réponse API:', response);
      
      // Vérifier si la réponse contient des erreurs partielles
      if (response.partial) {
        setError(response.error || 'Certaines données n\'ont pas pu être sauvegardées');
        setErrorDetails(response.details || []);
        setShowErrorPopup(true);
        // Les données principales sont sauvegardées, on continue
      }
      
      // Sauvegarder les options d'activités
      if (JSON.stringify(dayOptions) !== JSON.stringify(originalDayOptions)) {
        try {
          await adminApi.put(`/offers/${id}/options`, { options: dayOptions });
          setOriginalDayOptions(JSON.parse(JSON.stringify(dayOptions)));
        } catch (optErr: any) {
          console.error('Erreur sauvegarde options:', optErr);
          const optErrMsg = optErr.response?.data?.error || optErr.message || 'Erreur options';
          setError(prev => prev ? `${prev}\n${optErrMsg}` : optErrMsg);
          setErrorDetails(prev => prev ? [...prev, `Options: ${optErrMsg}`] : [`Options: ${optErrMsg}`]);
          setShowErrorPopup(true);
        }
      }
      
      // Sauvegarder les extensions
      if (JSON.stringify(extensions) !== JSON.stringify(originalExtensions)) {
        try {
          await adminApi.put(`/offers/${id}/extensions`, { extensions });
          setOriginalExtensions(JSON.parse(JSON.stringify(extensions)));
        } catch (extErr: any) {
          console.error('Erreur sauvegarde extensions:', extErr);
          const extErrMsg = extErr.response?.data?.error || extErr.message || 'Erreur extensions';
          setError(prev => prev ? `${prev}\n${extErrMsg}` : extErrMsg);
          setErrorDetails(prev => prev ? [...prev, `Extensions: ${extErrMsg}`] : [`Extensions: ${extErrMsg}`]);
          setShowErrorPopup(true);
        }
      }

      // Sauvegarder les hôtels
      if (JSON.stringify(hotels) !== JSON.stringify(originalHotels)) {
        try {
          await adminApi.put(`/offers/${id}/hotels`, { hotels });
          setOriginalHotels(JSON.parse(JSON.stringify(hotels)));
        } catch (hotelErr: any) {
          console.error('Erreur sauvegarde hôtels:', hotelErr);
          const hotelErrMsg = hotelErr.response?.data?.error || hotelErr.message || 'Erreur hôtels';
          setError(prev => prev ? `${prev}\n${hotelErrMsg}` : hotelErrMsg);
          setErrorDetails(prev => prev ? [...prev, `Hôtels: ${hotelErrMsg}`] : [`Hôtels: ${hotelErrMsg}`]);
          setShowErrorPopup(true);
        }
      }
      
      if (!response.partial) {
        setStatus('Offre enregistrée avec succès');
      } else {
        setStatus('Offre partiellement enregistrée - voir les erreurs');
      }
      setOriginalOffer(JSON.parse(JSON.stringify(offer)));
    } catch (e: any) {
      console.error('Erreur sauvegarde:', e);
      const errorMsg = e.response?.data?.error || e.message || 'Erreur de sauvegarde';
      const details = e.response?.data?.details;
      setError(errorMsg);
      if (Array.isArray(details)) {
        setErrorDetails(details);
      } else if (typeof details === 'string') {
        setErrorDetails([details]);
      }
      setShowErrorPopup(true);
    } finally {
      setSaving(false);
    }
  }

  function toggleId(arr: number[], id: number): number[] {
    return arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
  }

  // async function refreshUploads() {
  //   try {
  //     const up = await adminApi.get('/uploads').then(res => res.data);
  //     setUploads(up.data || []);
  //   } catch {}
  // }

  // async function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   setUploading(true);
  //   setStatus(null);
  //   setError(null);
  //   try {
  //     const fd = new FormData();
  //     fd.append('file', file);
  //     const res = await adminApi.post('/uploads', fd, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     });
  //     const data = res.data;
  //     if (data?.success === false) throw new Error(data?.error || 'Erreur upload');
  //     await refreshUploads();
  //     if (data.url && offer) {
  //       const newImage: OfferImage = {
  //         image_url: data.url,
  //         image_type: 'gallery',
  //         alt_text: '',
  //         sort_order: offer.images.length
  //       };
  //       setOffer({ ...offer, images: [...offer.images, newImage] });
  //     }
  //     setStatus('Image téléversée');
  //   } catch (err: any) {
  //     setError(err.message || 'Erreur upload');
  //   } finally {
  //     setUploading(false);
  //     // reset input
  //     e.target.value = '';
  //   }
  // }

  if (loading) return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center gap-2 text-sm text-neutral-600"><Spinner /> Chargement…</div>
    </div>
  );
  if (!offer) return null;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Popup d'erreur détaillé */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">Erreur de sauvegarde</h3>
                <p className="mt-1 text-sm text-neutral-700">{error}</p>
              </div>
            </div>
            
            {errorDetails && errorDetails.length > 0 && (
              <div className="mb-4 rounded-md bg-red-50 p-3">
                <p className="mb-2 text-sm font-medium text-red-800">Détails des erreurs :</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-red-700">
                  {errorDetails.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowErrorPopup(false);
                  setError(null);
                  setErrorDetails(null);
                }}
                className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowErrorPopup(false);
                  setError(null);
                  setErrorDetails(null);
                  save();
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Modifier l&apos;offre</h1>
        <div className="ml-auto">
          <Link
            href="/admin/offers"
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-300 h-10 px-4 text-sm"
          >
            ← Retour
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <label className="text-sm">
                Titre
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => setOffer({ ...(offer as OfferData), title: e.target.value })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                Slug
                <input
                  type="text"
                  value={offer.slug}
                  onChange={(e) => setOffer({ ...(offer as OfferData), slug: e.target.value })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
            </div>
            <div className="grid gap-3 mt-3">
              <label className="text-sm">
                Résumé
                <textarea
                  value={offer.summary || ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), summary: e.target.value })}
                  className="mt-1 w-full min-h-[80px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
            </div>
            <div className="mt-3">
              <label className="text-sm block mb-2">
                Description / Itinéraire
              </label>
              <ItineraryEditor
                value={offer.description || ''}
                onChange={(description) => setOffer({ ...(offer as OfferData), description })}
              />
            </div>
            <div className="grid gap-3 mt-3 md:grid-cols-2">
              <label className="text-sm">
                Label de l&apos;offre
                <input
                  type="text"
                  value={offer.label || ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), label: e.target.value || null })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                  placeholder="Ex: Nouveau, Populaire, Exclusif..."
                />
              </label>
              <label className="text-sm">
                Lien du programme (PDF ou page externe)
                <input
                  type="url"
                  value={offer.programme_link || ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), programme_link: e.target.value || null })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                  placeholder="https://.../programme.pdf"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Options d&apos;activités par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <DayOptionsEditor
              options={dayOptions}
              onChange={setDayOptions}
              maxDays={offer.duration_days || 30}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extensions / Prolongations</CardTitle>
          </CardHeader>
          <CardContent>
            <ExtensionEditor
              extensions={extensions}
              onChange={setExtensions}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hôtels</CardTitle>
          </CardHeader>
          <CardContent>
            <HotelEditor
              hotels={hotels}
              onChange={setHotels}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <OfferImagesManager
              images={offer.images}
              onChange={(images) => setOffer({ ...(offer as OfferData), images })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coordonnées de l&apos;itinéraire</CardTitle>
          </CardHeader>
          <CardContent>

            <div className="mb-5">
              <ImageInput
                label="Image de la carte de l'itinéraire"
                value={offer.map_image || ''}
                onChange={(url) => setOffer({ ...(offer as OfferData), map_image: url || null })}
                mode="both"
                placeholder="Sélectionnez ou uploadez une image de carte"
                previewClassName="h-48 w-full max-w-md"
              />
              <span className="text-xs text-gray-500 mt-1 block">Image statique de la carte (remplace la carte dynamique Leaflet)</span>
            </div>
            <CoordinatesEditor
              coordinates={offer.coordinates || []}
              onChange={(coordinates) => setOffer({ ...(offer as OfferData), coordinates })}
              description={offer.description}
              mapCenter={offer.map_center}
              onMapCenterChange={(map_center) => setOffer({ ...(offer as OfferData), map_center })}
              destinations={destinations.filter(d => offer.destinationIds?.includes(d.id)).map(d => ({ id: d.id, name: d.title }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut et prix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!offer.is_active}
                  onChange={(e) => setOffer({ ...(offer as OfferData), is_active: e.target.checked ? 1 : 0 })}
                  className="h-4 w-4"
                />
                Actif
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!offer.is_pro}
                  onChange={(e) => setOffer({ ...(offer as OfferData), is_pro: e.target.checked ? 1 : 0 })}
                  className="h-4 w-4"
                />
                Réservé aux Professionnels
              </label>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr,160px]">
              <label className="text-sm">
                Prix
                <input
                  type="number"
                  value={offer.price ?? ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), price: e.target.value === '' ? null : Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                Devise
                <input
                  type="text"
                  value={offer.price_currency || 'CAD'}
                  defaultValue={"CAD"}
                  onChange={(e) => setOffer({ ...(offer as OfferData), price_currency: e.target.value })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="text-sm">
                Durée (jours)
                <input
                  type="number"
                  value={offer.duration_days ?? ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), duration_days: e.target.value === '' ? null : Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
              <label className="text-sm">
                Durée (nuits)
                <input
                  type="number"
                  value={offer.duration_nights ?? ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), duration_nights: e.target.value === '' ? null : Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prix en promotion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-[1fr,160px]">
                <label className="text-sm">
                  Prix promotionnel
                  <input
                    type="number"
                    value={offer.promotional_price ?? ''}
                    onChange={(e) => setOffer({ ...(offer as OfferData), promotional_price: e.target.value === '' ? null : Number(e.target.value) })}
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                    placeholder="Laisser vide si pas de promotion"
                  />
                </label>
                <label className="text-sm">
                  Devise
                  <input
                  defaultValue={"CAD"}
                    type="text"
                    value={offer.promotional_price_currency || 'CAD'}
                    onChange={(e) => setOffer({ ...(offer as OfferData), promotional_price_currency: e.target.value })}
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                  />
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  Date de début de promotion
                  <input
                    type="date"
                    value={offer.promotion_start_date || ''}
                    onChange={(e) => setOffer({ ...(offer as OfferData), promotion_start_date: e.target.value || null })}
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                  />
                </label>
                <label className="text-sm">
                  Date de fin de promotion
                  <input
                    type="date"
                    value={offer.promotion_end_date || ''}
                    onChange={(e) => setOffer({ ...(offer as OfferData), promotion_end_date: e.target.value || null })}
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                  />
                </label>
              </div>
              <label className="text-sm">
                Description de la promotion
                <input
                  type="text"
                  value={offer.promotion_description || ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), promotion_description: e.target.value || null })}
                  className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                  placeholder="Ex: Offre spéciale été, Réduction early bird..."
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inclusions et exclusions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <label className="text-sm">
                Nos tarifs comprennent
                <textarea
                  value={offer.price_includes || ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), price_includes: e.target.value || null })}
                  className="mt-1 w-full min-h-[120px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                  placeholder="• Hébergement en pension complète&#10;• Vols internationaux&#10;• Transferts aéroport&#10;• Guide francophone&#10;• Assurance voyage..."
                />
              </label>
              <label className="text-sm">
                Nos tarifs ne comprennent pas
                <textarea
                  value={offer.price_excludes || ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), price_excludes: e.target.value || null })}
                  className="mt-1 w-full min-h-[120px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                  placeholder="• Boissons alcoolisées&#10;• Pourboires&#10;• Dépenses personnelles&#10;• Excursions optionnelles&#10;• Visa (si requis)..."
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {types.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={offer.typeIds.includes(t.id)}
                    onChange={() => setOffer({ ...(offer as OfferData), typeIds: toggleId(offer.typeIds, t.id) })}
                    className="h-4 w-4"
                  />
                  {t.title}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thèmes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {themes.map((t) => (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={offer.themeIds.includes(t.id)}
                    onChange={() => setOffer({ ...(offer as OfferData), themeIds: toggleId(offer.themeIds, t.id) })}
                    className="h-4 w-4"
                  />
                  {t.title}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {destinations.map((d) => (
                <label key={d.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={offer.destinationIds.includes(d.id)}
                    onChange={() => setOffer({ ...(offer as OfferData), destinationIds: toggleId(offer.destinationIds, d.id) })}
                    className="h-4 w-4"
                  />
                  {d.title}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Périodes de départ et prix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="text-sm text-neutral-600">
                Ajoutez des périodes avec une date de départ, une date de retour (optionnelle). Le prix est optionnel : vous pouvez annoncer une date sans prix connu et utiliser le champ texte pour préciser (ex: PRIX SUR DEMANDE).
                <span className="font-medium text-orange-600"> N&apos;oubliez pas de cliquer sur &quot;Enregistrer&quot; en bas pour sauvegarder.</span>
              </div>
              <div className="grid gap-2 md:grid-cols-[1fr,1fr,120px,100px,1fr,auto]">
                <label className="text-sm">
                  Date de départ
                  <input
                    type="date"
                    id="new-start-date"
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                    placeholder="jj/mm/aaaa"
                  />
                </label>
                <label className="text-sm">
                  Date de retour (optionnelle)
                  <input
                    type="date"
                    id="new-end-date"
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                    placeholder="jj/mm/aaaa"
                  />
                </label>
                <label className="text-sm">
                  Prix (optionnel)
                  <input
                    type="number"
                    id="new-date-price"
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                    placeholder="Ex: 3500"
                  />
                </label>
                <label className="text-sm">
                  Devise
                  <input
                    type="text"
                    id="new-date-currency"
                    defaultValue={"CAD"}
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                    placeholder="Ex: EUR, CAD, USD"
                  />
                </label>
                <label className="text-sm">
                  Texte affiché (optionnel)
                  <input
                    type="text"
                    id="new-date-note"
                    maxLength={255}
                    className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                    placeholder="Ex: COMPLET, PRIX SUR DEMANDE, TARIF PROMOTIONNEL"
                  />
                </label>
                <Button
                  onClick={() => {
                    const start = document.getElementById('new-start-date') as HTMLInputElement;
                    const end = document.getElementById('new-end-date') as HTMLInputElement;
                    const price = document.getElementById('new-date-price') as HTMLInputElement;
                    const currency = document.getElementById('new-date-currency') as HTMLInputElement;
                    const note = document.getElementById('new-date-note') as HTMLInputElement;
                    if (!start.value) {
                      setError('La date de départ est requise');
                      return;
                    }
                    const newEntry = {
                      departure_date: start.value,
                      return_date: end.value || null,
                      price: price.value === '' ? null : Number(price.value),
                      price_currency: (currency.value || 'EUR'),
                      price_note: note.value.trim() || null,
                    };
                    setOffer({
                      ...(offer as OfferData),
                      dates: [...(offer.dates || []), newEntry].sort((a,b) => a.departure_date.localeCompare(b.departure_date)),
                    });
                    start.value = '';
                    end.value = '';
                    price.value = '';
                    note.value = '';
                    setStatus('Période ajoutée - cliquez sur Enregistrer pour sauvegarder');
                  }}
                  className="px-4 py-2 text-sm"
                >
                  Ajouter
                </Button>
              </div>
              <div className="grid gap-2">
                {(offer.dates && offer.dates.length > 0) ? (
                  offer.dates.map((d, index) => (
                    editingDateIndex === index ? (
                      <div key={index} className="grid gap-2 rounded-md border-2 border-[--color-primary] bg-white px-3 py-3 md:grid-cols-[1fr,1fr,120px,100px,1fr,auto,auto]">
                        <label className="text-xs text-neutral-600">
                          Date de départ
                          <input
                            type="date"
                            value={dateDraft.departure_date}
                            onChange={(e) => setDateDraft({ ...dateDraft, departure_date: e.target.value })}
                            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                          />
                        </label>
                        <label className="text-xs text-neutral-600">
                          Date de retour
                          <input
                            type="date"
                            value={dateDraft.return_date}
                            onChange={(e) => setDateDraft({ ...dateDraft, return_date: e.target.value })}
                            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                          />
                        </label>
                        <label className="text-xs text-neutral-600">
                          Prix
                          <input
                            type="number"
                            value={dateDraft.price}
                            onChange={(e) => setDateDraft({ ...dateDraft, price: e.target.value })}
                            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                          />
                        </label>
                        <label className="text-xs text-neutral-600">
                          Devise
                          <input
                            type="text"
                            value={dateDraft.price_currency}
                            onChange={(e) => setDateDraft({ ...dateDraft, price_currency: e.target.value })}
                            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                          />
                        </label>
                        <label className="text-xs text-neutral-600">
                          Texte affiché
                          <input
                            type="text"
                            maxLength={255}
                            value={dateDraft.price_note}
                            onChange={(e) => setDateDraft({ ...dateDraft, price_note: e.target.value })}
                            placeholder="Ex: COMPLET, PRIX SUR DEMANDE"
                            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                          />
                        </label>
                        <Button
                          onClick={() => {
                            if (!dateDraft.departure_date) {
                              setError('La date de départ est requise');
                              return;
                            }
                            const updated = (offer.dates || []).map((entry, i) =>
                              i === index
                                ? {
                                    ...entry,
                                    departure_date: dateDraft.departure_date,
                                    return_date: dateDraft.return_date || null,
                                    price: dateDraft.price === '' ? null : Number(dateDraft.price),
                                    price_currency: dateDraft.price_currency || 'EUR',
                                    price_note: dateDraft.price_note.trim() || null,
                                  }
                                : entry
                            ).sort((a, b) => a.departure_date.localeCompare(b.departure_date));
                            setOffer({ ...(offer as OfferData), dates: updated });
                            setEditingDateIndex(null);
                            setStatus('Période modifiée - cliquez sur Enregistrer pour sauvegarder');
                          }}
                          className="self-end px-3 py-2 text-sm"
                        >
                          Enregistrer
                        </Button>
                        <button
                          onClick={() => setEditingDateIndex(null)}
                          className="self-end px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                    <div key={index} className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                      <span className="text-sm flex items-center gap-2">
                        {new Date(d.departure_date).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}
                        {d.return_date ? ` → ${new Date(d.return_date).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}` : ''}
                        {typeof d.price === 'number' ? ` — ${(d.price_currency || offer.price_currency || 'EUR')} ${d.price}` : ''}
                        {d.price_note && (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                            {d.price_note}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setDateDraft({
                              departure_date: toInputDate(d.departure_date),
                              return_date: toInputDate(d.return_date),
                              price: typeof d.price === 'number' ? String(d.price) : '',
                              price_currency: d.price_currency || offer.price_currency || 'CAD',
                              price_note: d.price_note || '',
                            });
                            setEditingDateIndex(index);
                          }}
                          className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline"
                        >
                          Modifier
                        </button>
                      <button
                        onClick={() => {
                          const updated = (offer.dates || []).filter((_, i) => i !== index);
                          setOffer({
                            ...(offer as OfferData),
                            dates: updated,
                          });
                          setStatus('Période supprimée - cliquez sur Enregistrer pour sauvegarder');
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                      </div>
                    </div>
                    )
                  ))
                ) : (
                  <div className="text-sm text-neutral-500 italic">Aucune période configurée</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages de statut */}
        {status && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <span className="text-sm text-green-700">{status}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}
      </div>

      {/* Bouton flottant Enregistrer */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-150">
          <div className="bg-white rounded-full shadow-2xl border border-neutral-200 px-6 py-3 flex items-center gap-4">
            <span className="text-sm text-neutral-600">Modifications non enregistrées</span>
            <Button onClick={save} disabled={!canSave || saving} className="rounded-full!">
              {saving ? (
                <span className="inline-flex items-center gap-2"><Spinner size={16} /> Enregistrement…</span>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
