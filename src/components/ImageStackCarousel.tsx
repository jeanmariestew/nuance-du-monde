"use client";

import { useState } from "react";
import Image from "next/image";

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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Préparer la liste des images
  const imageList = images.length > 0 
    ? images.map(img => img.image_url)
    : fallbackImage 
    ? [fallbackImage]
    : [];

  if (imageList.length === 0) {
    return (
      <div className="relative">
        <div className="w-full h-[500px] bg-linear-to-r from-yellow-600/50 to-yellow-900/50 rounded-3xl shadow-2xl" />
      </div>
    );
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  // Minimum distance de swipe (en pixels)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  // Gestion du swipe à la souris
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setMouseStart(e.clientX);
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !mouseStart) return;
    
    const distance = mouseStart - e.clientX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
    
    setIsDragging(false);
    setMouseStart(null);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
    setMouseStart(null);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Stack d'images en éventail - Style référence */}
      <div 
        className="relative h-[300px] sm:h-[400px] lg:h-[450px] xl:h-[500px] flex items-center justify-center select-none overflow-visible"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {/* Afficher toutes les images en éventail */}
        {imageList.map((img, index) => {
          const totalImages = imageList.length;
          const middleIndex = Math.floor(totalImages / 2);
          const isActive = index === currentIndex;
          
          // Position relative au centre
          const positionFromCenter = index - middleIndex;
          
          // Calculs pour l'éventail - responsive
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
          const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
          const isLarge = typeof window !== 'undefined' && window.innerWidth >= 1280;
          
          const rotation = positionFromCenter * (isMobile ? 5 : isLarge ? 6 : 8); // Rotation adaptée
          const translateX = positionFromCenter * (isMobile ? 40 : isTablet ? 55 : isLarge ? 65 : 75); // Espacement adaptatif
          const translateY = Math.abs(positionFromCenter) * (isMobile ? 10 : isLarge ? 12 : 15); // Légère courbe
          const scale = isActive ? 1 : (isMobile ? 0.75 : isLarge ? 0.88 : 0.85); // Image active plus grande
          const zIndex = isActive ? 100 : 50 - Math.abs(positionFromCenter);
          
          return (
            <div
              key={index}
              className="absolute transition-all duration-500 ease-out cursor-pointer"
              style={{
                transform: `
                  translateX(${translateX}px) 
                  translateY(${translateY}px) 
                  rotate(${rotation}deg) 
                  scale(${scale})
                `,
                zIndex: zIndex,
                opacity: isActive ? 1 : 0.8,
              }}
              onClick={() => goToImage(index)}
            >
              <Image
                src={img}
                width={600}
                height={400}
                className="w-[280px] h-[200px] sm:w-[360px] sm:h-[250px] lg:w-[420px] lg:h-[300px] xl:w-[480px] xl:h-[340px] rounded-xl sm:rounded-2xl object-cover shadow-2xl"
                alt={`${title} - Image ${index + 1}`}
                priority={index === 0}
              />
            </div>
          );
        })}

        {/* Counter */}
        {imageList.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold z-110">
            {currentIndex + 1} / {imageList.length}
          </div>
        )}
      </div>

      {/* Dots Navigation */}
      {imageList.length > 1 && (
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 lg:mt-8">
          {imageList.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`transition-all ${
                index === currentIndex
                  ? "w-8 sm:w-10 h-2.5 sm:h-3 bg-yellow-600"
                  : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-300 hover:bg-gray-400"
              } rounded-full`}
              aria-label={`Aller à l'image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
