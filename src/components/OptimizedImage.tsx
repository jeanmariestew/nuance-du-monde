import Image from 'next/image';
import { CldImage } from 'next-cloudinary';

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
  // Gestionnaire d'erreur par défaut
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Essayer d'utiliser une image de fallback si elle existe
    if (target.src !== "/images/destination_fond.png" && target.src !== "/images/fallback.png") {
      target.src = "/images/destination_fond.png";
      // Empêcher la récursion infinie
      target.onerror = null;
    }

    // Appeler le gestionnaire onError personnalisé si fourni
    if (onError) {
      onError(e);
    }
  };

  // Si c'est déjà une URL Cloudinary, utilise directement
  if (src.includes('cloudinary.com')) {
    return (
      <CldImage
        src={src}
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
      src={src}
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
