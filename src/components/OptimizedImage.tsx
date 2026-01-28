import { CldImage } from 'next-cloudinary';

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  ...props
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  [key: string]: any;
}) {
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
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
      {...props}
    />
  );
}
