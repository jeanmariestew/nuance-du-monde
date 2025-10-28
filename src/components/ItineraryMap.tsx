"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    // Destroy existing map if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Create map
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add markers and create polyline
    const latLngs: L.LatLngExpression[] = [];
    
    locations.forEach((location, index) => {
      // Petit décalage aléatoire pour éviter la superposition
      const offset = 0.002;
      const latOffset = (Math.random() - 0.5) * offset;
      const lngOffset = (Math.random() - 0.5) * offset;
      
      const latLng: L.LatLngExpression = [
        location.lat + latOffset, 
        location.lng + lngOffset
      ];
      latLngs.push(latLng);

      // Custom icon for markers with destination name
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <div style="
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              color: white;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 16px;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
              position: relative;
            ">
              ${index + 1}
            </div>
            <div style="
              background: rgba(0,0,0,0.85);
              color: white;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 13px;
              font-weight: 600;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              border: 1px solid rgba(255,255,255,0.2);
            ">
              ${location.name}
            </div>
          </div>
        `,
        iconSize: [120, 80],
        iconAnchor: [60, 40],
      });

      // Add marker
      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong style="font-size: 16px; color: #d97706;">Étape ${index + 1}</strong><br/>
          <span style="font-size: 14px;">${location.name}</span>
        </div>
      `);
    });

    // Draw route line - S'assurer que tous les trajets sont connectés
    if (latLngs.length > 1) {
      // Ligne principale
      L.polyline(latLngs, {
        color: "#f59e0b",
        weight: 4,
        opacity: 0.8,
        dashArray: "15, 10",
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // Ligne d'ombre pour plus de visibilité
      L.polyline(latLngs, {
        color: "#000000",
        weight: 6,
        opacity: 0.3,
        dashArray: "15, 10",
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);
    }

    // Centrer sur la destination du milieu avec un zoom approprié
    if (latLngs.length > 0) {
      const middleIndex = Math.floor(latLngs.length / 2);
      const centerPoint = latLngs[middleIndex];
      
      // Calculer le zoom en fonction du nombre de destinations
      let zoomLevel = 7; // Zoom par défaut
      if (latLngs.length <= 3) {
        zoomLevel = 8; // Plus de zoom pour peu de destinations
      } else if (latLngs.length <= 5) {
        zoomLevel = 7;
      } else {
        zoomLevel = 6; // Moins de zoom pour beaucoup de destinations
      }
      
      map.setView(centerPoint as L.LatLngExpression, zoomLevel);
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  if (locations.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
        <p className="text-gray-500">Aucune localisation disponible</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {title && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-2xl" />
    </div>
  );
}
