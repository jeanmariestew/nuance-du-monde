"use client";

import OptimizedImage from "@/components/OptimizedImage";

export type HomePopupConfig = {
  enabled: boolean;
  mediaType: "video" | "animated_image" | "image";
  mediaUrl: string;
  title?: string;
};

type Props = {
  config: HomePopupConfig | null;
};

/** Bannière inline (pas un overlay) entre le hero et les types de voyages. */
export default function HomePopup({ config }: Props) {
  if (!config?.enabled || !config.mediaUrl) return null;

  const title = config.title?.trim() || "Présentation";
  const isVideo = config.mediaType === "video";

  return (
    <section className="relative w-full bg-neutral-950" aria-label={title}>
      {config.title?.trim() && (
        <div className="mx-auto max-w-5xl px-4 pb-2 pt-4 text-center sm:text-left">
          <h2 className="text-sm font-semibold tracking-wide text-white sm:text-base">
            {config.title.trim()}
          </h2>
        </div>
      )}

      <div className="mx-auto w-full max-w-5xl">
        {isVideo ? (
          <video
            src={config.mediaUrl}
            controls
            playsInline
            preload="metadata"
            className="aspect-video max-h-[70vh] w-full object-contain bg-black"
          />
        ) : (
          <OptimizedImage
            src={config.mediaUrl}
            alt={title}
            width={1600}
            height={675}
            className="max-h-[70vh] w-full object-contain"
            priority
          />
        )}
      </div>
    </section>
  );
}
