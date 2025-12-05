"use client";

import { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// Rendu dynamique Leaflet temporairement désactivé
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface ItineraryMapProps {
  locations: Location[];
  title?: string;
}

export default function ItineraryMap({ locations, title }: ItineraryMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  // const mapInstanceRef = useRef<L.Map | null>(null);

  // useEffect(() => {
  //   if (!mapRef.current || locations.length === 0) return;
  //   // Toute la logique Leaflet est temporairement désactivée
  // }, [locations]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center rounded-2xl bg-gray-50 overflow-hidden">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          {title}
        </h3>
      )}
      <div className="w-full max-w-xl mb-4">
        <img
          src="/images/map.png"
          alt="Visualisation de l'itinéraire bientôt disponible"
          className="w-[200px] m-auto h-auto object-cover"
        />
      </div>
      <p className="text-center text-sm sm:text-base text-gray-600 px-4">
        La visualisation de ce circuit sur une carte interactive sera bientôt disponible.
      </p>
    </div>
  );
}
