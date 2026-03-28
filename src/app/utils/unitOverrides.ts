const UNIT_OVERRIDES_KEY = 'frontendUnitOverrides';

export type UnitOverrideValue =
  | string
  | {
      unit?: string;
      readingLabel?: string;
      scaleA?: number;
      offsetB?: number;
    };

export type UnitOverrideMap = Record<string, UnitOverrideValue>;

const DATA_KEY_TO_SENSOR_KEY: Record<string, string> = {
  wind_speed: 'wind_speed',
  wind_gust: 'wind_gust',
  value: 'value',
  temperature_weather: 'temperature_weather',
  humidity_weather: 'humidity_weather',
  solar_radiation: 'solar_radiation',
  precipitation_rate: 'precipitation_rate',
  et0: 'et0',
  vpd: 'vpd',
  pressure_weather: 'vpd',
  waterFlow: 'water_flow',
  waterflow: 'water_flow',
  phwater: 'water_ph',
  waterec: 'water_ec',
  soilLow: 'soil_moisture_low',
  soilMedium: 'soil_moisture_medium',
  soilHigh: 'soil_moisture_high',
  low: 'soil_temp_low',
  medium: 'soil_temp_medium',
  high: 'soil_temp_high',
};

const NAME_TO_SENSOR_KEY: Record<string, string> = {
  "température de l'air (°c)": 'temperature_weather',
  'température (°c)': 'temperature_weather',
  'humidité (%)': 'humidity_weather',
  'vitesse du vent (km/h)': 'wind_speed',
  'rafale de vent (km/h)': 'wind_gust',
  'direction du vent (°)': 'wind_direction',
  'rayonnement solaire (w/m²)': 'solar_radiation',
  'radiation solaire': 'solar_radiation',
  'et₀ (mm)': 'et0',
  'taux de précipitation (mm/h)': 'precipitation_rate',
  'irrigation (l/min)': 'water_flow',
  'pression (bar)': 'water_pressure',
  'ph (-)': 'water_ph',
  'ph sol (-)': 'soil_ph',
  'conductivité électrique (µs/cm)': 'water_ec',
};

export function getUnitOverrideMap(): UnitOverrideMap {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(UNIT_OVERRIDES_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as UnitOverrideMap;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function getUnitOverride(
  sensorKey: string | undefined,
  fallback?: string
): string {
  if (!sensorKey) return fallback ?? '';
  const map = getUnitOverrideMap();
  const value = map[sensorKey];
  if (typeof value === 'string') return value || fallback || '';
  if (value && typeof value === 'object' && typeof value.unit === 'string') {
    return value.unit || fallback || '';
  }
  return fallback ?? '';
}

export function getUnitOverrideFromDataKey(
  dataKey: string | undefined,
  fallback?: string
): string {
  if (!dataKey) return fallback ?? '';
  const sensorKey = DATA_KEY_TO_SENSOR_KEY[dataKey] ?? dataKey;
  return getUnitOverride(sensorKey, fallback);
}

export function getUnitOverrideFromSeriesName(
  seriesName: string | undefined,
  fallback?: string
): string {
  if (!seriesName) return fallback ?? '';
  const key = NAME_TO_SENSOR_KEY[seriesName.toLowerCase()];
  return key ? getUnitOverride(key, fallback) : (fallback ?? '');
}
