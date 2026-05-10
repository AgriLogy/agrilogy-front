/** `mapSymbol` = marker shown on the map for this captor type. */
export const SENSOR_TYPES = [
  {
    id: 'soil_moisture',
    label: 'Humidité sol',
    color: '#2e924f',
    mapSymbol: '💧',
  },
  {
    id: 'soil_temperature',
    label: 'Température sol',
    color: '#f59e0b',
    mapSymbol: '🌡️',
  },
  {
    id: 'air_temperature',
    label: 'Température air',
    color: '#ef4444',
    mapSymbol: '🌤️',
  },
  {
    id: 'humidity_air',
    label: 'Humidité air',
    color: '#8b5cf6',
    mapSymbol: '💨',
  },
  {
    id: 'weather_station',
    label: 'Station météo',
    color: '#4cae70',
    mapSymbol: '🛰️',
  },
  {
    id: 'water_level',
    label: 'Niveau d’eau',
    color: '#2e924f',
    mapSymbol: '🌊',
  },
  { id: 'flow_meter', label: 'Débitmètre', color: '#db2777', mapSymbol: '🔧' },
  { id: 'pressure', label: 'Pression', color: '#ca8a04', mapSymbol: '📟' },
  {
    id: 'ec_soil',
    label: 'Conductivité (EC)',
    color: '#65a30d',
    mapSymbol: '⚡',
  },
  { id: 'ph_soil', label: 'pH sol', color: '#7c3aed', mapSymbol: '🧪' },
] as const;

export type SensorTypeId = (typeof SENSOR_TYPES)[number]['id'];

export function getSensorTypeMeta(id: string) {
  return (
    SENSOR_TYPES.find((t) => t.id === id) ?? {
      id,
      label: id,
      color: '#6b7280',
      mapSymbol: '📍',
    }
  );
}

/** Mapbox `match` for halo `circle-color` under the icon. */
export function sensorTypeColorMatchExpression(): unknown[] {
  const pairs: unknown[] = [];
  for (const t of SENSOR_TYPES) {
    pairs.push(t.id, t.color);
  }
  pairs.push('#6b7280');
  return ['match', ['get', 'sensorType'], ...pairs];
}
