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
import RichTextField from '@/components/admin/RichTextField';
import DayOptionsEditor, { DayOption } from '@/components/admin/DayOptionsEditor';
import ExtensionEditor, { OfferExtension } from '@/components/admin/ExtensionEditor';
import HotelEditor, { OfferHotel } from '@/components/admin/HotelEditor';
import FitPaxPricesEditor from '@/components/admin/FitPaxPricesEditor';
import AdminToggle from '@/components/admin/AdminToggle';
import AdminCheckbox from '@/components/admin/AdminCheckbox';
import AdminMultiSelectGrid from '@/components/admin/AdminMultiSelectGrid';
import { adminInputClass, adminLabelClass } from '@/components/admin/adminFormStyles';
import { FIT_TRAVEL_TYPE_SLUG } from '@/lib/fitPaxPrices';
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
  hide_extensions: 0 | 1;
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
  dates?: { id?: number; departure_date: string; return_date?: string | null; price?: number | null; price_currency?: string | null; price_note?: string | null; hide_price?: 0 | 1 }[];
  typeIds: number[];
  themeIds: number[];
  destinationIds: number[];
  fit_pax_prices: string[];
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
  const [dateDraft, setDateDraft] = useState<{ departure_date: string; return_date: string; price: string; price_currency: string; price_note: string; hide_price: boolean }>({
    departure_date: '', return_date: '', price: '', price_currency: 'CAD', price_note: '', hide_price: false,
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
      // Si une date est en cours d'édition, valider le brouillon avant l'envoi
      // (sinon hide_price / price_note restent uniquement dans dateDraft et sont perdus).
      let offerSnapshot = offer;
      if (editingDateIndex !== null) {
        if (!dateDraft.departure_date) {
          setError('La date de départ est requise');
          setSaving(false);
          return;
        }
        const updatedDates = (offer.dates || []).map((entry, i) =>
          i === editingDateIndex
            ? {
                ...entry,
                departure_date: dateDraft.departure_date,
                return_date: dateDraft.return_date || null,
                price: dateDraft.price === '' ? null : Number(dateDraft.price),
                price_currency: dateDraft.price_currency || 'EUR',
                price_note: dateDraft.price_note.trim() || null,
                hide_price: (dateDraft.hide_price ? 1 : 0) as 0 | 1,
              }
            : entry
        ).sort((a, b) => a.departure_date.localeCompare(b.departure_date));
        offerSnapshot = { ...offer, dates: updatedDates };
        setOffer(offerSnapshot);
        setEditingDateIndex(null);
      }

      // Formater les dates pour MySQL (YYYY-MM-DD uniquement)
      const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        // Si c'est déjà au format YYYY-MM-DD, le garder tel quel
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        // Sinon, extraire juste la partie date d'un timestamp ISO
        return dateStr.split('T')[0];
      };

      const dataToSave = {
        ...offerSnapshot,
        dates: (offerSnapshot.dates || []).map((d) => ({
          ...d,
          hide_price: d.hide_price ? 1 : 0,
          price_note: d.price_note?.trim() || null,
        })),
        promotion_start_date: formatDate(offerSnapshot.promotion_start_date),
        promotion_end_date: formatDate(offerSnapshot.promotion_end_date),
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
      setOriginalOffer(JSON.parse(JSON.stringify(offerSnapshot)));
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
    <div className={`mx-auto max-w-6xl ${hasChanges ? "pb-24" : ""}`}>
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

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold sm:text-2xl">Modifier l&apos;offre</h1>
        <Link
          href="/admin/offers"
          className="inline-flex h-10 w-fit items-center justify-center rounded-lg px-4 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
        >
          ← Retour
        </Link>
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
          <CardContent className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Publication</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AdminToggle
                  checked={!!offer.is_active}
                  onChange={(checked) => setOffer({ ...(offer as OfferData), is_active: checked ? 1 : 0 })}
                  label="Actif"
                  description="Visible sur le site public"
                />
                <AdminToggle
                  checked={!!offer.is_pro}
                  onChange={(checked) => setOffer({ ...(offer as OfferData), is_pro: checked ? 1 : 0 })}
                  label="Réservé aux professionnels"
                  description="Accessible aux agents connectés"
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Affichage public</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AdminToggle
                  checked={!!offer.hide_extensions}
                  onChange={(checked) => setOffer({ ...(offer as OfferData), hide_extensions: checked ? 1 : 0 })}
                  label="Masquer les extensions"
                  description="Cache la section extensions sur la fiche"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className={adminLabelClass}>
                Prix
                <input
                  type="number"
                  value={offer.price ?? ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), price: e.target.value === '' ? null : Number(e.target.value) })}
                  className={adminInputClass}
                />
              </label>
              <label className={adminLabelClass}>
                Devise
                <input
                  type="text"
                  value={offer.price_currency || 'CAD'}
                  onChange={(e) => setOffer({ ...(offer as OfferData), price_currency: e.target.value })}
                  className={adminInputClass}
                />
              </label>
              <label className={adminLabelClass}>
                Durée (jours)
                <input
                  type="number"
                  value={offer.duration_days ?? ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), duration_days: e.target.value === '' ? null : Number(e.target.value) })}
                  className={adminInputClass}
                />
              </label>
              <label className={adminLabelClass}>
                Durée (nuits)
                <input
                  type="number"
                  value={offer.duration_nights ?? ''}
                  onChange={(e) => setOffer({ ...(offer as OfferData), duration_nights: e.target.value === '' ? null : Number(e.target.value) })}
                  className={adminInputClass}
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
              <div className="text-sm">
                Nos tarifs comprennent
                <RichTextField
                  lists
                  autoList
                  value={offer.price_includes || ''}
                  onChange={(price_includes) => setOffer({ ...(offer as OfferData), price_includes: price_includes || null })}
                  minHeight={120}
                  placeholder={"Hébergement en pension complète\nVols internationaux\nTransferts aéroport\nGuide francophone"}
                />
                <span className="mt-1 block text-xs text-neutral-500">Collez depuis Word pour garder le gras, l&apos;italique et les couleurs. Plusieurs lignes deviennent une liste à puces.</span>
              </div>
              <div className="text-sm">
                Nos tarifs ne comprennent pas
                <RichTextField
                  lists
                  autoList
                  value={offer.price_excludes || ''}
                  onChange={(price_excludes) => setOffer({ ...(offer as OfferData), price_excludes: price_excludes || null })}
                  minHeight={120}
                  placeholder={"Boissons alcoolisées\nPourboires\nDépenses personnelles\nExcursions optionnelles"}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Types</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminMultiSelectGrid
              items={types}
              selectedIds={offer.typeIds}
              onChange={(typeIds) => setOffer({ ...(offer as OfferData), typeIds })}
              searchPlaceholder="Rechercher un type…"
              emptyLabel="Aucun type trouvé"
            />
          </CardContent>
        </Card>

        {types.some((type) => type.slug === FIT_TRAVEL_TYPE_SLUG && offer.typeIds.includes(type.id)) && (
          <Card>
            <CardHeader>
              <CardTitle>Prix FIT</CardTitle>
            </CardHeader>
            <CardContent>
              <FitPaxPricesEditor
                prices={offer.fit_pax_prices || []}
                onChange={(fit_pax_prices) => setOffer({ ...(offer as OfferData), fit_pax_prices })}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Thèmes</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminMultiSelectGrid
              items={themes}
              selectedIds={offer.themeIds}
              onChange={(themeIds) => setOffer({ ...(offer as OfferData), themeIds })}
              searchPlaceholder="Rechercher un thème…"
              emptyLabel="Aucun thème trouvé"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminMultiSelectGrid
              items={destinations}
              selectedIds={offer.destinationIds}
              onChange={(destinationIds) => setOffer({ ...(offer as OfferData), destinationIds })}
              searchPlaceholder="Rechercher une destination…"
              emptyLabel="Aucune destination trouvée"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Périodes de départ et prix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <p className="text-sm text-neutral-600">
                Ajoutez des périodes avec une date de départ, une date de retour (optionnelle). Le prix est optionnel : vous pouvez annoncer une date sans prix connu et utiliser le champ texte pour préciser (ex: PRIX SUR DEMANDE).
                <span className="font-medium text-orange-600"> N&apos;oubliez pas de cliquer sur &quot;Enregistrer&quot; en bas pour sauvegarder.</span>
              </p>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <label className={adminLabelClass}>
                    Date de départ
                    <input
                      type="date"
                      id="new-start-date"
                      min={new Date().toISOString().split('T')[0]}
                      className={adminInputClass}
                    />
                  </label>
                  <label className={adminLabelClass}>
                    Date de retour (optionnelle)
                    <input
                      type="date"
                      id="new-end-date"
                      className={adminInputClass}
                    />
                  </label>
                  <label className={adminLabelClass}>
                    Prix (optionnel)
                    <input
                      type="number"
                      id="new-date-price"
                      className={adminInputClass}
                      placeholder="Ex: 3500"
                    />
                  </label>
                  <label className={adminLabelClass}>
                    Devise
                    <input
                      type="text"
                      id="new-date-currency"
                      defaultValue="CAD"
                      className={adminInputClass}
                      placeholder="Ex: EUR, CAD, USD"
                    />
                  </label>
                  <label className={`${adminLabelClass} sm:col-span-2 lg:col-span-1`}>
                    Texte affiché (optionnel)
                    <input
                      type="text"
                      id="new-date-note"
                      maxLength={255}
                      className={adminInputClass}
                      placeholder="Ex: COMPLET, PRIX SUR DEMANDE"
                    />
                  </label>
                  <label className="flex items-start gap-2 sm:col-span-2 lg:col-span-2 text-sm text-neutral-700">
                    <input type="checkbox" id="new-date-hide-price" className="mt-0.5 h-4 w-4 rounded border-neutral-300" />
                    <span>
                      <span className="font-medium">Masquer le prix de cette date</span>
                      <span className="block text-xs text-neutral-500">Le montant n’apparaît pas ; le texte libre (ex. PRIX SUR DEMANDE) reste visible</span>
                    </span>
                  </label>
                  <div className="flex items-end sm:col-span-2 lg:col-span-1">
                    <Button
                      onClick={() => {
                        const start = document.getElementById('new-start-date') as HTMLInputElement;
                        const end = document.getElementById('new-end-date') as HTMLInputElement;
                        const price = document.getElementById('new-date-price') as HTMLInputElement;
                        const currency = document.getElementById('new-date-currency') as HTMLInputElement;
                        const note = document.getElementById('new-date-note') as HTMLInputElement;
                        const hidePrice = document.getElementById('new-date-hide-price') as HTMLInputElement;
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
                          hide_price: (hidePrice?.checked ? 1 : 0) as 0 | 1,
                        };
                        setOffer({
                          ...(offer as OfferData),
                          dates: [...(offer.dates || []), newEntry].sort((a,b) => a.departure_date.localeCompare(b.departure_date)),
                        });
                        start.value = '';
                        end.value = '';
                        price.value = '';
                        note.value = '';
                        if (hidePrice) hidePrice.checked = false;
                        setStatus('Période ajoutée - cliquez sur Enregistrer pour sauvegarder');
                      }}
                      className="w-full"
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid gap-3">
                {(offer.dates && offer.dates.length > 0) ? (
                  offer.dates.map((d, index) => (
                    editingDateIndex === index ? (
                      <div key={index} className="grid grid-cols-1 gap-3 rounded-xl border-2 border-neutral-900 bg-white p-3 sm:grid-cols-2 lg:grid-cols-3 sm:p-4">
                        <label className={adminLabelClass}>
                          Date de départ
                          <input
                            type="date"
                            value={dateDraft.departure_date}
                            onChange={(e) => setDateDraft({ ...dateDraft, departure_date: e.target.value })}
                            className={adminInputClass}
                          />
                        </label>
                        <label className={adminLabelClass}>
                          Date de retour
                          <input
                            type="date"
                            value={dateDraft.return_date}
                            onChange={(e) => setDateDraft({ ...dateDraft, return_date: e.target.value })}
                            className={adminInputClass}
                          />
                        </label>
                        <label className={adminLabelClass}>
                          Prix
                          <input
                            type="number"
                            value={dateDraft.price}
                            onChange={(e) => setDateDraft({ ...dateDraft, price: e.target.value })}
                            className={adminInputClass}
                          />
                        </label>
                        <label className={adminLabelClass}>
                          Devise
                          <input
                            type="text"
                            value={dateDraft.price_currency}
                            onChange={(e) => setDateDraft({ ...dateDraft, price_currency: e.target.value })}
                            className={adminInputClass}
                          />
                        </label>
                        <label className={`${adminLabelClass} sm:col-span-2 lg:col-span-1`}>
                          Texte affiché
                          <input
                            type="text"
                            maxLength={255}
                            value={dateDraft.price_note}
                            onChange={(e) => setDateDraft({ ...dateDraft, price_note: e.target.value })}
                            placeholder="Ex: COMPLET, PRIX SUR DEMANDE"
                            className={adminInputClass}
                          />
                        </label>
                        <div className="sm:col-span-2 lg:col-span-3">
                          <AdminCheckbox
                            variant="card"
                            checked={dateDraft.hide_price}
                            onChange={(checked) => setDateDraft({ ...dateDraft, hide_price: checked })}
                            label="Masquer le prix de cette date"
                            description="Le montant n’apparaît pas sur le site ; le texte libre reste visible"
                          />
                        </div>
                        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row lg:col-span-1 lg:items-end">
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
                                      hide_price: (dateDraft.hide_price ? 1 : 0) as 0 | 1,
                                    }
                                  : entry
                              ).sort((a, b) => a.departure_date.localeCompare(b.departure_date));
                              setOffer({ ...(offer as OfferData), dates: updated });
                              setEditingDateIndex(null);
                              setStatus('Période modifiée - cliquez sur Enregistrer pour sauvegarder');
                            }}
                            className="w-full sm:flex-1"
                          >
                            Enregistrer
                          </Button>
                          <button
                            type="button"
                            onClick={() => setEditingDateIndex(null)}
                            className="inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-medium text-neutral-600 hover:bg-neutral-100 sm:w-auto"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                    <div key={index} className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-medium text-neutral-900">
                          {new Date(d.departure_date).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}
                          {d.return_date ? ` → ${new Date(d.return_date).toLocaleDateString('fr-FR', { timeZone: 'UTC' })}` : ''}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                          {d.hide_price ? (
                            <span className="inline-flex items-center rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-700">
                              Prix masqué
                            </span>
                          ) : typeof d.price === 'number' ? (
                            <span>{(d.price_currency || offer.price_currency || 'EUR')} {d.price}</span>
                          ) : (
                            <span className="text-neutral-400">Sans prix</span>
                          )}
                          {d.price_note && (
                            <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                              {d.price_note}
                            </span>
                          )}
                        </div>
                        <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-neutral-700">
                          <input
                            type="checkbox"
                            checked={!!d.hide_price}
                            onChange={(e) => {
                              const updated = (offer.dates || []).map((entry, i) =>
                                i === index
                                  ? { ...entry, hide_price: (e.target.checked ? 1 : 0) as 0 | 1 }
                                  : entry
                              );
                              setOffer({ ...(offer as OfferData), dates: updated });
                              setStatus('Masquage prix modifié — cliquez sur Enregistrer pour sauvegarder');
                            }}
                            className="h-4 w-4 rounded border-neutral-300"
                          />
                          Masquer le prix de cette date
                        </label>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setDateDraft({
                              departure_date: toInputDate(d.departure_date),
                              return_date: toInputDate(d.return_date),
                              price: typeof d.price === 'number' ? String(d.price) : '',
                              price_currency: d.price_currency || offer.price_currency || 'CAD',
                              price_note: d.price_note || '',
                              hide_price: !!d.hide_price,
                            });
                            setEditingDateIndex(index);
                          }}
                          className="text-sm font-medium text-neutral-700 underline hover:text-neutral-900"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (offer.dates || []).filter((_, i) => i !== index);
                            setOffer({
                              ...(offer as OfferData),
                              dates: updated,
                            });
                            setStatus('Période supprimée - cliquez sur Enregistrer pour sauvegarder');
                          }}
                          className="text-sm font-medium text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    )
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-500">
                    Aucune période configurée
                  </div>
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

      {/* Barre d'enregistrement */}
      {hasChanges && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
          <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white/95 px-3 py-3 shadow-xl backdrop-blur sm:px-5">
            <span className="hidden text-sm text-neutral-600 sm:inline">Modifications non enregistrées</span>
            <span className="text-sm text-neutral-600 sm:hidden">Non enregistré</span>
            <Button onClick={save} disabled={!canSave || saving} className="shrink-0 rounded-xl">
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
