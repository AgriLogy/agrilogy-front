'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface OpenStreetMapProps {
  lat: number;
  lon: number;
}

// Fix default marker icon in Next.js (webpack resolves paths incorrectly)
const fixLeafletIcon = () => {
  const DefaultIcon = L.Icon.Default;
  if (DefaultIcon.prototype._getIconUrl) {
    delete (DefaultIcon.prototype as unknown as { _getIconUrl?: string })
      ._getIconUrl;
  }
  DefaultIcon.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

const OpenStreetMap = ({ lat, lon }: OpenStreetMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    fixLeafletIcon();

    const map = L.map(container).setView([lat, lon], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(map);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup('This is your location')
      .openPopup();

    // Leaflet needs layout to be done; invalidateSize fixes damaged map when container gets real dimensions
    const rafId = requestAnimationFrame(() => {
      map.invalidateSize();
    });

    const resizeHandler = () => map.invalidateSize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(rafId);
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lon]);

  return (
    <div
      ref={containerRef}
      className="leaflet-map-container"
      style={{
        width: '100%',
        height: '100%',
        minHeight: 280,
      }}
    />
  );
};

export default OpenStreetMap;
