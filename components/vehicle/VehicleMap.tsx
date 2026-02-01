import React, { useEffect, useRef, useId } from "react";
import L from "leaflet";

interface VehicleMapProps {
  latitude: number;
  longitude: number;
  label: string;
  bearing: number;
}

// Custom Bus Icon using DivIcon
const createBusIcon = () =>
  L.divIcon({
    html: `
    <div style="
      background-color: #0066b2;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 6v6"></path>
        <path d="M15 6v6"></path>
        <path d="M2 12h19.6"></path>
        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
        <circle cx="7" cy="18" r="2"></circle>
        <path d="M9 18h5"></path>
        <circle cx="16" cy="18" r="2"></circle>
      </svg>
    </div>
  `,
    className: "custom-bus-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

const VehicleMap: React.FC<VehicleMapProps> = ({
  latitude,
  longitude,
  label,
  bearing,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const uniqueId = useId();

  // Validate coordinates
  const isValidLocation =
    latitude &&
    longitude &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180;

  // Initialize and cleanup map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || !isValidLocation) return;

    // Create map
    const map = L.map(container, {
      center: [latitude, longitude],
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Create marker
    const marker = L.marker([latitude, longitude], {
      icon: createBusIcon(),
    }).addTo(map);

    marker.bindPopup(`
      <div class="text-center">
        <strong class="block text-primary text-sm mb-1">${label}</strong>
        <span class="text-xs text-muted">Heading: ${bearing}°</span>
      </div>
    `);

    mapRef.current = map;
    markerRef.current = marker;

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [uniqueId]); // Only reinitialize if component instance changes

  // Update map view and marker when props change
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !isValidLocation) return;

    const position: L.LatLngExpression = [latitude, longitude];

    mapRef.current.setView(position, mapRef.current.getZoom());
    markerRef.current.setLatLng(position);
    markerRef.current.setPopupContent(`
      <div class="text-center">
        <strong class="block text-primary text-sm mb-1">${label}</strong>
        <span class="text-xs text-muted">Heading: ${bearing}°</span>
      </div>
    `);
  }, [latitude, longitude, label, bearing, isValidLocation]);

  if (!isValidLocation) {
    return (
      <div className="h-full w-full bg-gray-100 flex flex-col items-center justify-center text-muted p-4 rounded-lg">
        <p className="font-medium">Lokasi tidak valid</p>
        <p className="text-sm">
          Koordinat: {latitude}, {longitude}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden relative isolate z-0">
      <div
        ref={mapContainerRef}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      />
    </div>
  );
};

export default VehicleMap;
