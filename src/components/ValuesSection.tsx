'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const valuesData = [
  {
    number: '01',
    title: 'AUTHENTICITÉ',
    description: 'Vivez des expériences authentiques en découvrant les cultures, les cuisines et les modes de vie locaux, partout dans le monde.'
  },
  {
    number: '02',
    title: 'DURABILITÉ',
    description: 'Engagés envers un tourisme responsable, nous intégrons des pratiques durables pour préserver les destinations que nous aimons.'
  },
  {
    number: '03',
    title: 'INNOVATION',
    description: 'Nous repoussons sans cesse les limites pour vous offrir des voyages uniques et personnalisés, toujours à la pointe de l\'innovation.'
  },
  {
    number: '04',
    title: 'FLEXIBILITÉ DE PAIEMENT',
    description: 'Profitez de solutions de paiement flexibles, y compris des options de versements échelonnés pour faciliter votre projet de voyage.'
  },
  {
    number: '05',
    title: 'PASSION',
    description: 'La passion pour le voyage est au cœur de notre société et nous voulons partager cette passion avec vous.'
  }
];

const images = ['/images/deco1.png', '/images/deco2.png', '/images/deco3.png', '/images/deco4.png'];

export default function ValuesSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Values list */}
          <div className="space-y-8">
            {valuesData.map((value, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <span className="text-4xl font-bold text-yellow-500">
                    {value.number}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - Image Slider */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={images[currentImageIndex]}
                alt="Destination de rêve"
                fill
                className="object-cover transition-opacity duration-500"
                key={currentImageIndex}
              />
              
              {/* Floating navigation dots */}
              <div className="absolute left-6 top-1/2 transform flex flex-col -translate-y-1/2 space-y-3">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToImage(i)}
                    className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 hover:scale-110 ${
                      i === currentImageIndex ? 'bg-white' : 'bg-transparent hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation arrows */}
              <div className="absolute left-4 top-1/3 space-y-20">
                <button 
                  onClick={prevImage}
                  className="w-8 h-8 bg-white rounded border border-white/30 flex items-center justify-center text-yellow-600 hover:bg-white/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button 
                  onClick={nextImage}
                  className="w-8 h-8 bg-white rounded border border-white/30 flex items-center justify-center text-yellow-600 hover:bg-white/30 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
