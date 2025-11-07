import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'rectangle' | 'offer-card' | 'destination-card' | 'theme-card';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ 
  variant = 'rectangle', 
  count = 1,
  className = '' 
}: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";
  
  const renderSkeleton = () => {
    switch (variant) {
      case 'offer-card':
        return (
          <div className={`bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-2 border-gray-200 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-5 h-full md:h-[280px]">
              {/* Image skeleton */}
              <div className="relative md:col-span-2 h-[220px] md:h-auto">
                <div className={`${baseClasses} w-full h-full`} />
              </div>
              
              {/* Content skeleton */}
              <div className="md:col-span-3 p-5 sm:p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Title */}
                  <div className={`${baseClasses} h-8 w-3/4 rounded`} />
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <div className={`${baseClasses} h-4 w-full rounded`} />
                    <div className={`${baseClasses} h-4 w-5/6 rounded`} />
                  </div>
                  
                  {/* Duration */}
                  <div className={`${baseClasses} h-4 w-1/2 rounded`} />
                </div>
                
                {/* Price skeleton */}
                <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 mt-4">
                  <div className={`${baseClasses} h-4 w-20 rounded mb-2`} />
                  <div className={`${baseClasses} h-8 w-32 rounded`} />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'destination-card':
        return (
          <div className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}>
            <div className={`${baseClasses} w-full h-64`} />
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
              <div className={`${baseClasses} h-6 w-3/4 rounded`} />
              <div className={`${baseClasses} h-4 w-1/2 rounded`} />
            </div>
          </div>
        );
        
      case 'theme-card':
        return (
          <div className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}>
            <div className={`${baseClasses} w-full h-80`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${baseClasses} h-8 w-40 rounded`} />
            </div>
          </div>
        );
        
      case 'card':
        return (
          <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
            <div className={`${baseClasses} h-48 w-full rounded mb-4`} />
            <div className={`${baseClasses} h-4 w-3/4 rounded mb-2`} />
            <div className={`${baseClasses} h-4 w-1/2 rounded`} />
          </div>
        );
        
      case 'text':
        return <div className={`${baseClasses} h-4 rounded ${className}`} />;
        
      case 'circle':
        return <div className={`${baseClasses} rounded-full ${className}`} />;
        
      case 'rectangle':
      default:
        return <div className={`${baseClasses} rounded ${className}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
}

// Composants spécialisés pour faciliter l'utilisation
export function OfferCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto auto-rows-fr">
      <SkeletonLoader variant="offer-card" count={count} />
    </div>
  );
}

export function DestinationCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SkeletonLoader variant="destination-card" count={count} />
    </div>
  );
}

export function ThemeCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      <SkeletonLoader variant="theme-card" count={count} className="w-full max-w-sm" />
    </div>
  );
}
