// components/Map.tsx
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "ACCESS_TOKEN";

interface MapboxType {
  latitude: number;
  longitude: number;
}

const Mapbox = ({ latitude, longitude }: MapboxType) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 12,
    });

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

    return () => map.remove();
  }, [latitude, longitude]);

  return <div ref={mapContainer} style={{ height: "400px", width: "100%" }} />;
};

export default Mapbox;
