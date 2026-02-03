"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { parseItinerary, extractLocations } from "@/lib/itineraryParser";

interface Coordinate {
  name: string;
  lat: number;
  lng: number;
}

interface MapCenter {
  lat: number;
  lng: number;
  zoom: number;
}

interface CoordinatesEditorProps {
  coordinates: Coordinate[];
  onChange: (coordinates: Coordinate[]) => void;
  description?: string;
  mapCenter?: MapCenter | null;
  onMapCenterChange?: (center: MapCenter | null) => void;
}

export default function CoordinatesEditor({
  coordinates,
  onChange,
  description,
  mapCenter,
  onMapCenterChange,
}: CoordinatesEditorProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylinesRef = useRef<L.Polyline[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [manualName, setManualName] = useState("");
  const [pendingClick, setPendingClick] = useState<{ lat: number; lng: number } | null>(null);
  const [clickName, setClickName] = useState("");
  

  // Initialiser la carte
  useEffect(() => {
    if (!mapRef.current) return;

    // Nettoyer la carte existante
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Créer la carte centrée sur le monde
    const map = L.map(mapRef.current, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView([30, 10], 2);

    mapInstanceRef.current = map;

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Gérer les clics sur la carte
    map.on("click", (e: L.LeafletMouseEvent) => {
      setPendingClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      setClickName("");
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Mettre à jour les marqueurs quand les coordonnées changent
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Supprimer les anciens marqueurs
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Supprimer les anciennes lignes
    polylinesRef.current.forEach((line) => line.remove());
    polylinesRef.current = [];

    // Ajouter les nouveaux marqueurs (style client)
    coordinates.forEach((coord, index) => {
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
          ">${coord.name}</div>
        `,
        iconSize: [40, 60],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([coord.lat, coord.lng], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`<strong>${index + 1}. ${coord.name}</strong><br>Lat: ${coord.lat.toFixed(4)}<br>Lng: ${coord.lng.toFixed(4)}`);

      markersRef.current.push(marker);
    });

    // Tracer la ligne entre les points (style client avec double ligne)
    if (coordinates.length > 1) {
      const latLngs: L.LatLngExpression[] = coordinates.map((c) => [c.lat, c.lng]);

      // Ligne d'ombre
      const shadowLine = L.polyline(latLngs, {
        color: "#000000",
        weight: 6,
        opacity: 0.3,
        dashArray: "15, 10",
        lineCap: "round",
      }).addTo(mapInstanceRef.current);
      polylinesRef.current.push(shadowLine);

      // Ligne principale
      const mainLine = L.polyline(latLngs, {
        color: "#f59e0b",
        weight: 4,
        opacity: 0.8,
        dashArray: "15, 10",
        lineCap: "round",
      }).addTo(mapInstanceRef.current);
      polylinesRef.current.push(mainLine);
    }

    // Centrer la carte
    if (mapCenter && mapCenter.lat && mapCenter.lng) {
      // Utiliser le centre personnalisé
      mapInstanceRef.current.setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom || 7);
    } else if (coordinates.length > 0) {
      // Centrer sur les coordonnées (style client)
      const latLngs: L.LatLngExpression[] = coordinates.map((c) => [c.lat, c.lng]);
      const middleIndex = Math.floor(latLngs.length / 2);
      const centerPoint = latLngs[middleIndex];

      let zoomLevel = 7;
      if (latLngs.length <= 3) zoomLevel = 8;
      else if (latLngs.length <= 5) zoomLevel = 7;
      else zoomLevel = 6;

      mapInstanceRef.current.setView(centerPoint, zoomLevel);
      const bounds = L.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, mapCenter]);

  // Ajouter un marqueur temporaire pour le clic en attente
  useEffect(() => {
    if (!mapInstanceRef.current || !pendingClick) return;

    const tempIcon = L.divIcon({
      className: "temp-marker",
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          animation: pulse 1s infinite;
        ">?</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const tempMarker = L.marker([pendingClick.lat, pendingClick.lng], { icon: tempIcon })
      .addTo(mapInstanceRef.current);

    return () => {
      tempMarker.remove();
    };
  }, [pendingClick]);

  // Générer les coordonnées depuis la description avec IA
  async function generateFromDescription() {
    if (!description) return;
    
    setIsGenerating(true);
    try {
      // Appel à l'API qui utilise Gemini côté serveur
      const response = await fetch('/api/admin/extract-coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: description }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          const validCoords = result.data
            .filter((c: { lat?: number; lng?: number }) => c.lat && c.lng)
            .map((c: { day: number; location: string; lat: number; lng: number }) => ({
              name: `Jour ${c.day}: ${c.location}`,
              lat: c.lat,
              lng: c.lng,
            }));
          
          if (validCoords.length > 0) {
            onChange(validCoords);
            return;
          }
        }
      }
      
      // Fallback: utiliser l'ancienne méthode si l'API échoue
      const itinerary = parseItinerary(description);
      const locations = await extractLocations(itinerary);
      
      if (locations.length > 0) {
        onChange(locations);
      }
    } catch (error) {
      console.error("Erreur lors de la génération des coordonnées:", error);
      // Fallback en cas d'erreur
      try {
        const itinerary = parseItinerary(description);
        const locations = await extractLocations(itinerary);
        if (locations.length > 0) {
          onChange(locations);
        }
      } catch (fallbackError) {
        console.error("Erreur fallback:", fallbackError);
      }
    } finally {
      setIsGenerating(false);
    }
  }

  // Ajouter une coordonnée depuis le clic sur la carte
  function addFromClick() {
    if (!pendingClick || !clickName.trim()) return;
    
    const newCoord: Coordinate = {
      name: clickName.trim(),
      lat: Number(pendingClick.lat.toFixed(6)),
      lng: Number(pendingClick.lng.toFixed(6)),
    };
    
    onChange([...coordinates, newCoord]);
    setPendingClick(null);
    setClickName("");
  }

  // Ajouter une coordonnée manuellement
  function addManual() {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng) || !manualName.trim()) return;
    
    const newCoord: Coordinate = {
      name: manualName.trim(),
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
    };
    
    onChange([...coordinates, newCoord]);
    setManualLat("");
    setManualLng("");
    setManualName("");
  }

  // Supprimer une coordonnée
  function removeCoordinate(index: number) {
    const updated = coordinates.filter((_, i) => i !== index);
    onChange(updated);
  }

  // Déplacer une coordonnée vers le haut
  function moveUp(index: number) {
    if (index === 0) return;
    const updated = [...coordinates];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  }

  // Déplacer une coordonnée vers le bas
  function moveDown(index: number) {
    if (index === coordinates.length - 1) return;
    const updated = [...coordinates];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated);
  }

  // Annuler le clic en attente
  function cancelClick() {
    setPendingClick(null);
    setClickName("");
  }

  // Fonction pour définir le centre depuis la position actuelle de la carte
  function setCenterFromMap() {
    if (!mapInstanceRef.current || !onMapCenterChange) return;
    const center = mapInstanceRef.current.getCenter();
    const zoom = mapInstanceRef.current.getZoom();
    const newCenter = {
      lat: Number(center.lat.toFixed(6)),
      lng: Number(center.lng.toFixed(6)),
      zoom: zoom,
    };
    onMapCenterChange(newCenter);
  }

  // Fonction pour effacer le centre
  function clearCenter() {
    if (!onMapCenterChange) return;
    onMapCenterChange(null);
  }

  return (
    <div className="space-y-4">
      {/* Boutons d'action */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={generateFromDescription}
          disabled={!description || isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Génération...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Générer depuis la description
            </>
          )}
        </button>
        {coordinates.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Tout effacer
          </button>
        )}
        {onMapCenterChange && (
          <button
            type="button"
            onClick={setCenterFromMap}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Enregistrer la vue actuelle
          </button>
        )}
      </div>

      {/* Layout principal : Carte à gauche, Liste à droite (style client) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte interactive */}
        <div className="order-2 lg:order-1">
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <div
              ref={mapRef}
              className="w-full h-full"
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-neutral-600 shadow-lg">
              <span className="font-medium">💡 Cliquez sur la carte pour ajouter un point</span>
            </div>
          </div>
          
          {/* Indicateur du centre de la carte */}
          {mapCenter && (
            <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <p className="text-xs text-green-700">
                ✓ Centre défini : {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)} (zoom {mapCenter.zoom})
              </p>
              <button
                type="button"
                onClick={clearCenter}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Effacer
              </button>
            </div>
          )}
        </div>

        {/* Liste des points (style timeline) */}
        <div className="order-1 lg:order-2">
          <div className="h-[500px] overflow-y-auto rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 p-4 shadow-xl">
            {/* Modal pour nommer le point cliqué */}
            {pendingClick && (
              <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold animate-pulse">
                    ?
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">
                      Point sélectionné : {pendingClick.lat.toFixed(4)}, {pendingClick.lng.toFixed(4)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={clickName}
                        onChange={(e) => setClickName(e.target.value)}
                        placeholder="Nom du lieu..."
                        className="flex-1 rounded-md border border-yellow-300 bg-white px-3 py-1.5 text-sm focus:border-yellow-500 focus:outline-none"
                        onKeyDown={(e) => e.key === "Enter" && addFromClick()}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={addFromClick}
                        disabled={!clickName.trim()}
                        className="px-3 py-1.5 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 text-sm font-medium"
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={cancelClick}
                        className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 text-sm font-medium"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des coordonnées (style timeline) */}
            {coordinates.length > 0 ? (
              <div className="space-y-4">
                {coordinates.map((coord, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 relative"
                  >
                    {/* Ligne de connexion */}
                    {index < coordinates.length - 1 && (
                      <div className="absolute left-5 top-12 w-0.5 h-full bg-linear-to-b from-yellow-400 to-yellow-600 -z-10" />
                    )}
                    
                    {/* Numéro */}
                    <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                      {index + 1}
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 bg-white rounded-xl p-3 shadow-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {coord.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded disabled:opacity-30"
                            title="Monter"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveDown(index)}
                            disabled={index === coordinates.length - 1}
                            className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded disabled:opacity-30"
                            title="Descendre"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCoordinate(index)}
                            className="p-1 text-red-400 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Supprimer"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                <svg className="h-16 w-16 mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-center">
                  Aucun point d&apos;itinéraire.<br />
                  <span className="text-sm">Cliquez sur la carte ou générez depuis la description.</span>
                </p>
              </div>
            )}

            {/* Ajout manuel */}
            <div className="mt-4 bg-white/80 rounded-xl p-3">
              <p className="text-xs font-medium text-neutral-600 mb-2">Ajouter manuellement</p>
              <div className="grid grid-cols-[1fr,1fr,2fr] gap-2 mb-2">
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="Lat"
                  className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm"
                />
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="Lng"
                  className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Nom du lieu"
                  className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && addManual()}
                />
              </div>
              <button
                type="button"
                onClick={addManual}
                disabled={!manualLat || !manualLng || !manualName.trim()}
                className="w-full px-3 py-1.5 bg-neutral-800 text-white rounded-md hover:bg-neutral-900 disabled:opacity-50 text-sm font-medium"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
