"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import OptimizedImage from "@/components/OptimizedImage";

interface OfferImage {
  id?: number;
  image_url: string;
  image_type?: "main" | "gallery" | "banner";
  alt_text?: string;
  sort_order?: number;
}

interface ImageStackCarouselProps {
  images: OfferImage[];
  fallbackImage?: string;
  title: string;
}

export default function ImageStackCarousel({
  images,
  fallbackImage,
  title,
}: ImageStackCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Préparer la liste des images
  const imageList =
    images.length > 0
      ? images.map((img) => img.image_url)
      : fallbackImage
      ? [fallbackImage]
      : [];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  }, [imageList.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  }, [imageList.length]);

  // Auto-play pour le carousel mobile (5s)
  useEffect(() => {
    if (imageList.length <= 1 || modalOpen) return;
    autoPlayRef.current = setInterval(goToNext, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [goToNext, imageList.length, modalOpen]);

  // Fermer la modal avec Escape
  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "ArrowRight")
        setModalIndex((prev) => (prev + 1) % imageList.length);
      if (e.key === "ArrowLeft")
        setModalIndex(
          (prev) => (prev - 1 + imageList.length) % imageList.length
        );
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalOpen, imageList.length]);

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  if (imageList.length === 0) {
    return (
      <div className="relative ">
        <div className="w-full h-[400px] bg-linear-to-r from-yellow-600/50 to-yellow-900/50 rounded-3xl shadow-2xl" />
      </div>
    );
  }

  return (
    <>
      {/* ===================== MOBILE : carousel auto ===================== */}
      <div className="block lg:hidden relative w-full pt-5">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          {/* Slides */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {imageList.map((img, index) => (
              <button
                key={index}
                type="button"
                className="min-w-full focus:outline-none"
                onClick={() => openModal(index)}
              >
                <OptimizedImage
                  src={img}
                  width={800}
                  height={520}
                  className="w-full h-[300px] sm:h-[420px] object-cover"
                  alt={`${title} - Image ${index + 1}`}
                  priority={index === 0}
                />
              </button>
            ))}
          </div>

          {/* Flèches */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={() => {
                  goToPrev();
                  if (autoPlayRef.current) clearInterval(autoPlayRef.current);
                  autoPlayRef.current = setInterval(goToNext, 5000);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors z-10"
                aria-label="Image précédente"
              >
                ‹
              </button>
              <button
                onClick={() => {
                  goToNext();
                  if (autoPlayRef.current) clearInterval(autoPlayRef.current);
                  autoPlayRef.current = setInterval(goToNext, 5000);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors z-10"
                aria-label="Image suivante"
              >
                ›
              </button>
            </>
          )}

          {/* Compteur */}
          {imageList.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full z-10">
              {currentIndex + 1} / {imageList.length}
            </div>
          )}
        </div>

        {/* Dots */}
        {imageList.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {imageList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2.5 bg-yellow-500"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===================== DESKTOP : stack éventail ===================== */}
      <div className="hidden lg:block relative w-full max-w-4xl mx-auto">
        <div className="relative h-[450px] xl:h-[500px] flex items-center justify-center select-none overflow-visible">
          {imageList.map((img, index) => {
            const totalImages = imageList.length;
            const middleIndex = Math.floor(totalImages / 2);
            const isActive = index === currentIndex;

            // Position relative au milieu (pour la disposition en éventail)
            const positionFromCenter = index - middleIndex;

            // Distance à l'image active (pour le zIndex)
            const distanceFromActive = Math.abs(index - currentIndex);

            const rotation = positionFromCenter * 6;
            const translateX = positionFromCenter * 65;
            const translateY = Math.abs(positionFromCenter) * 12;
            const scale = isActive ? 1 : 0.86;
            // zIndex : l'image active est devant, puis celles adjacentes, etc.
            const zIndex = isActive ? 100 : Math.max(1, 80 - distanceFromActive * 15);

            return (
              <div
                key={index}
                className="absolute transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg) scale(${scale})`,
                  zIndex,
                  opacity: isActive ? 1 : 0.82,
                }}
                onClick={() => {
                  if (isActive) {
                    openModal(index);
                  } else {
                    setCurrentIndex(index);
                  }
                }}
              >
                <OptimizedImage
                  src={img}
                  width={600}
                  height={400}
                  className="w-[380px] h-[260px] xl:w-[460px] xl:h-[320px] rounded-2xl object-cover shadow-2xl"
                  alt={`${title} - Image ${index + 1}`}
                  priority={index === 0}
                />
              </div>
            );
          })}

          {/* Compteur */}
          {imageList.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-5 py-1.5 rounded-full text-sm font-semibold z-[110]">
              {currentIndex + 1} / {imageList.length}
            </div>
          )}
        </div>

        {/* Dots */}
        {imageList.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {imageList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all rounded-full ${
                  index === currentIndex
                    ? "w-10 h-3 bg-yellow-500"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===================== MODAL plein écran ===================== */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-colors z-10"
            aria-label="Fermer"
          >
            ×
          </button>

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage
              src={imageList[modalIndex]}
              width={1400}
              height={900}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
              alt={`${title} - Image ${modalIndex + 1}`}
              priority
            />
          </div>

          {/* Flèches modal */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalIndex(
                    (prev) => (prev - 1 + imageList.length) % imageList.length
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 rounded-full w-12 h-12 flex items-center justify-center text-3xl transition-colors"
                aria-label="Image précédente"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalIndex((prev) => (prev + 1) % imageList.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 rounded-full w-12 h-12 flex items-center justify-center text-3xl transition-colors"
                aria-label="Image suivante"
              >
                ›
              </button>
            </>
          )}

          {/* Compteur modal */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {modalIndex + 1} / {imageList.length}
          </div>
        </div>
      )}
    </>
  );
}
