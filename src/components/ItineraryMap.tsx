"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import OptimizedImage from "@/components/OptimizedImage";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface ItineraryMapProps {
  locations: Location[];
  title?: string;
  mapCenter?: { lat: number; lng: number; zoom: number } | null;
}

export interface ItineraryMapRef {
  zoomToDay: (dayIndex: number) => void;
}

// Fonction pour décaler les pins qui se superposent
function getOffsetForDuplicates(locations: Location[], index: number): { latOffset: number; lngOffset: number } {
  const current = locations[index];
  let duplicateCount = 0;
  let duplicateIndex = 0;
  
  // Compter combien de pins ont les mêmes coordonnées avant celui-ci
  for (let i = 0; i < locations.length; i++) {
    if (Math.abs(locations[i].lat - current.lat) < 0.001 && Math.abs(locations[i].lng - current.lng) < 0.001) {
      if (i < index) duplicateIndex++;
      duplicateCount++;
    }
  }
  
  // Si pas de duplicata, pas de décalage
  if (duplicateCount <= 1) return { latOffset: 0, lngOffset: 0 };
  
  // Décaler en cercle autour du point central
  const angle = (duplicateIndex * 2 * Math.PI) / duplicateCount;
  const offset = 0.008; // ~800m de décalage
  return {
    latOffset: Math.sin(angle) * offset,
    lngOffset: Math.cos(angle) * offset,
  };
}

const ItineraryMap = forwardRef<ItineraryMapRef, ItineraryMapProps>(function ItineraryMap({ locations, title, mapCenter }, ref) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const adjustedLocationsRef = useRef<Array<{ lat: number; lng: number }>>([]);

  // Exposer la fonction zoomToDay au parent
  useImperativeHandle(ref, () => ({
    zoomToDay: (dayIndex: number) => {
      if (mapInstanceRef.current && adjustedLocationsRef.current[dayIndex]) {
        const loc = adjustedLocationsRef.current[dayIndex];
        mapInstanceRef.current.setView([loc.lat, loc.lng], 12, { animate: true });
        // Ouvrir le popup du marqueur
        if (markersRef.current[dayIndex]) {
          markersRef.current[dayIndex].openPopup();
        }
      }
    },
  }));

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    // Nettoyer la carte existante
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Créer la carte
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Créer les coordonnées pour les marqueurs et la ligne (avec décalage pour les duplicatas)
    const adjustedLocations = locations.map((loc, index) => {
      const offset = getOffsetForDuplicates(locations, index);
      return {
        lat: loc.lat + offset.latOffset,
        lng: loc.lng + offset.lngOffset,
      };
    });
    adjustedLocationsRef.current = adjustedLocations;
    
    const latLngs: L.LatLngExpression[] = adjustedLocations.map((loc) => [loc.lat, loc.lng]);

    // Réinitialiser les marqueurs
    markersRef.current = [];

    // Ajouter les marqueurs avec numéros
    locations.forEach((loc, index) => {
      const adjustedLoc = adjustedLocations[index];
      
      // Créer un icône personnalisé avec numéro
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          ">${index + 1}</div>
          <div style="
            position: absolute;
            top: 44px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            white-space: nowrap;
            font-weight: 500;
          ">${loc.name}</div>
        `,
        iconSize: [40, 60],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([adjustedLoc.lat, adjustedLoc.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${index + 1}. ${loc.name}</strong>`);
      
      markersRef.current.push(marker);
    });

    // Ajouter la ligne de trajet (double ligne pour visibilité)
    if (latLngs.length > 1) {
      // Ligne d'ombre
      L.polyline(latLngs, {
        color: "#000000",
        weight: 6,
        opacity: 0.3,
        dashArray: "15, 10",
        lineCap: "round",
      }).addTo(map);

      // Ligne principale
      L.polyline(latLngs, {
        color: "#f59e0b",
        weight: 4,
        opacity: 0.8,
        dashArray: "15, 10",
        lineCap: "round",
      }).addTo(map);
    }

    // Centrer la carte
    if (mapCenter && mapCenter.lat && mapCenter.lng) {
      // Utiliser le centre personnalisé
      map.setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom || 7);
    } else if (latLngs.length > 0) {
      // Centrer sur le milieu de l'itinéraire avec zoom adaptatif
      const middleIndex = Math.floor(latLngs.length / 2);
      const centerPoint = latLngs[middleIndex];

      let zoomLevel = 7;
      if (latLngs.length <= 3) zoomLevel = 8;
      else if (latLngs.length <= 5) zoomLevel = 7;
      else zoomLevel = 6;

      map.setView(centerPoint, zoomLevel);

      // Ajuster pour voir tous les points
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, mapCenter]);

  // Si pas de locations, afficher un placeholder
  if (locations.length === 0) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center rounded-2xl bg-gray-50 overflow-hidden">
        {title && (
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            {title}
          </h3>
        )}
        <div className="w-full max-w-xl mb-4">
          <OptimizedImage
            src="/images/map.png"
            alt="Carte non disponible"
            width={200}
            height={200}
            className="w-[200px] m-auto h-auto object-cover"
          />
        </div>
        <p className="text-center text-sm sm:text-base text-gray-600 px-4">
          Aucune localisation disponible pour afficher la carte.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-2xl" />
    </div>
  );
});

export default ItineraryMap;
