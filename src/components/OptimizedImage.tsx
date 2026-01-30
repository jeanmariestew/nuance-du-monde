'use client';

import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

const FALLBACK_IMAGE = "/images/destination_fond.png";

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
  onError,
  ...props
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  [key: string]: any;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Validation de la source
  const isValidSrc = src && typeof src === 'string' && src.trim() !== '';
  
  // Utiliser le fallback si src invalide ou erreur
  const effectiveSrc = (!isValidSrc || hasError) ? FALLBACK_IMAGE : imgSrc;

  // Gestionnaire d'erreur par défaut
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }

    // Appeler le gestionnaire onError personnalisé si fourni
    if (onError) {
      onError(e);
    }
  };

  // Si c'est déjà une URL Cloudinary, utilise directement
  if (isValidSrc && effectiveSrc.includes('cloudinary.com')) {
    return (
      <CldImage
        src={effectiveSrc}
        alt={alt}
        width={width}
        height={height}
        quality="auto"
        format="auto"
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        onError={handleError}
        {...props}
      />
    );
  }

  // Pour les images locales, utilise next/image normal
  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={handleError}
      {...props}
    />
  );
}
