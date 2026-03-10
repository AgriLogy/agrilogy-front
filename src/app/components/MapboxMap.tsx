import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapboxProps {
  lat: number;
  lon: number;
}

const MapboxMap = ({ lat, lon }: MapboxProps) => {
  useEffect(() => {
    mapboxgl.accessToken = 'your_mapbox_access_token';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lon, lat],
      zoom: 13,
    });

    new mapboxgl.Marker()
      .setLngLat([lon, lat])
      .setPopup(new mapboxgl.Popup().setHTML('This is your location'))
      .addTo(map);

    return () => {
      map.remove();
    };
  }, [lat, lon]);

  return <div id="map" style={{ height: '100%', width: '100%' }}></div>;
};

export default MapboxMap;
