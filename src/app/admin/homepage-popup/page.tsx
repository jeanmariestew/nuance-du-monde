"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { adminApi } from "@/lib/axios";
import Spinner from "@/components/ui/Spinner";
import AdminToggle from "@/components/admin/AdminToggle";
import AdminSelect from "@/components/admin/AdminSelect";
import MediaUploadInput, {
  type HomePopupMediaType,
} from "@/components/admin/MediaUploadInput";
import { adminInputClass, adminLabelClass } from "@/components/admin/adminFormStyles";

const MEDIA_OPTIONS = [
  { value: "video", label: "Vidéo" },
  { value: "animated_image", label: "Image animée (GIF / WebP)" },
  { value: "image", label: "Image fixe" },
];

export default function AdminHomepagePopupPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [mediaType, setMediaType] = useState<HomePopupMediaType>("video");
  const [mediaUrl, setMediaUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await adminApi.get("/settings");
        const data = res.data;
        if (mounted && data.success) {
          const d = data.data || {};
          setEnabled(String(d.home_popup_enabled || "0") === "1");
          const type = (d.home_popup_media_type || "video") as HomePopupMediaType;
          setMediaType(
            ["video", "animated_image", "image"].includes(type) ? type : "video"
          );
          setMediaUrl(d.home_popup_media_url || "");
          setTitle(d.home_popup_title || "");
        }
      } catch {
        // ignore
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await adminApi.post("/settings", {
        home_popup_enabled: enabled ? "1" : "0",
        home_popup_media_type: mediaType,
        home_popup_media_url: mediaUrl.trim(),
        home_popup_title: title.trim(),
      });
      if (res.data?.success) {
                    setStatus("Bannière enregistrée");
      } else {
        setStatus(res.data?.error || "Erreur lors de la sauvegarde");
      }
    } catch (e: unknown) {
      setStatus(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bannière page d&apos;accueil</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Section affichée sous le hero, avant « Types de voyages » (ex. concept
          VRDF). Visible uniquement si activée et qu&apos;un média est renseigné —
          ce n&apos;est pas un overlay qui couvre la page.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Spinner /> Chargement…
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Affichage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AdminToggle
                checked={enabled}
                onChange={setEnabled}
                label="Afficher la bannière"
                description="Si désactivé, la section n’apparaît pas sur la page d’accueil"
              />
              <label className={adminLabelClass}>
                Titre (optionnel)
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={adminInputClass}
                  placeholder="Ex. Découvrez nos voyages VRDF"
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <AdminSelect
                label="Type de média"
                value={mediaType}
                options={MEDIA_OPTIONS}
                onChange={(e) =>
                  setMediaType(e.target.value as HomePopupMediaType)
                }
              />
              <MediaUploadInput
                label="Média du popup"
                value={mediaUrl}
                onChange={setMediaUrl}
                mediaType={mediaType}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 pt-4">
              {status && (
                <p
                  className={`text-sm ${
                    status.includes("Erreur") ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {status}
                </p>
              )}
              <Button onClick={save} disabled={saving}>
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner /> Enregistrement…
                  </span>
                ) : (
                  "Enregistrer"
                )}
              </Button>
              {enabled && !mediaUrl.trim() && (
                <p className="text-sm text-amber-700">
                  La bannière est activée mais sans média : elle ne s’affichera pas
                  tant qu’un fichier ou une URL n’est pas renseigné.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
