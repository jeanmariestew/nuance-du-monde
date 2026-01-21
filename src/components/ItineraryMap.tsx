"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

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

export default function ItineraryMap({ locations, title, mapCenter }: ItineraryMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

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

    // Créer les coordonnées pour les marqueurs et la ligne
    const latLngs: L.LatLngExpression[] = locations.map((loc) => [loc.lat, loc.lng]);

    // Ajouter les marqueurs avec numéros
    locations.forEach((loc, index) => {
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

      L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${index + 1}. ${loc.name}</strong>`);
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
          <Image
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
}
