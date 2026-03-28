export type SensorCatalogItem = {
  key: string;
  readingLabel: string;
  typeLabel: string;
  defaultUnit: string;
  category: 'lecture' | 'sensor';
};

const CUSTOM_SENSORS_KEY = 'customSensorsCatalog';

export const SENSOR_CATALOG: SensorCatalogItem[] = [
  {
    key: 'solar_radiation',
    readingLabel: 'Rayonnement',
    typeLabel: 'Rayonnement',
    defaultUnit: 'W/m²',
    category: 'lecture',
  },
  {
    key: 'temperature_weather',
    readingLabel: 'Température',
    typeLabel: 'Température',
    defaultUnit: '°C',
    category: 'lecture',
  },
  {
    key: 'humidity_weather',
    readingLabel: 'Humidité',
    typeLabel: 'Humidité',
    defaultUnit: '%',
    category: 'lecture',
  },
  {
    key: 'wind_speed',
    readingLabel: 'Vitesse du vent',
    typeLabel: 'Vitesse du vent',
    defaultUnit: 'km/h',
    category: 'lecture',
  },
  {
    key: 'wind_gust',
    readingLabel: 'Vitesse de rafale',
    typeLabel: 'Vitesse de rafale',
    defaultUnit: 'km/h',
    category: 'lecture',
  },
  {
    key: 'wind_direction',
    readingLabel: 'Direction du vent',
    typeLabel: 'Direction du vent',
    defaultUnit: '°',
    category: 'lecture',
  },
  {
    key: 'et0',
    readingLabel: 'Évapotranspiration quotidienne',
    typeLabel: 'Évapotranspiration ET₀',
    defaultUnit: 'mm',
    category: 'lecture',
  },
  {
    key: 'vpd',
    readingLabel: 'Déficit de pression de vapeur',
    typeLabel: 'VPD',
    defaultUnit: 'kPa',
    category: 'lecture',
  },
  {
    key: 'precipitation_rate',
    readingLabel: 'Précipitation',
    typeLabel: 'Taux de précipitation',
    defaultUnit: 'mm/h',
    category: 'lecture',
  },
  {
    key: 'water_flow',
    readingLabel: 'Débit eau / irrigation',
    typeLabel: 'Débit',
    defaultUnit: 'L/min',
    category: 'lecture',
  },
  {
    key: 'water_pressure',
    readingLabel: "Pression d'eau",
    typeLabel: 'Pression',
    defaultUnit: 'bar',
    category: 'lecture',
  },
  {
    key: 'water_ph',
    readingLabel: "pH de l'eau",
    typeLabel: 'pH eau',
    defaultUnit: 'pH',
    category: 'lecture',
  },
  {
    key: 'water_ec',
    readingLabel: "Conductivité de l'eau",
    typeLabel: 'EC eau',
    defaultUnit: 'µS/cm',
    category: 'lecture',
  },
  {
    key: 'soil_moisture_low',
    readingLabel: 'Humidité sol bas',
    typeLabel: 'Humidité sol',
    defaultUnit: '%',
    category: 'lecture',
  },
  {
    key: 'soil_moisture_medium',
    readingLabel: 'Humidité sol moyen',
    typeLabel: 'Humidité sol',
    defaultUnit: '%',
    category: 'lecture',
  },
  {
    key: 'soil_moisture_high',
    readingLabel: 'Humidité sol haut',
    typeLabel: 'Humidité sol',
    defaultUnit: '%',
    category: 'lecture',
  },
  {
    key: 'soil_temp_low',
    readingLabel: 'Température sol basse',
    typeLabel: 'Température sol',
    defaultUnit: '°C',
    category: 'lecture',
  },
  {
    key: 'soil_temp_medium',
    readingLabel: 'Température sol moyenne',
    typeLabel: 'Température sol',
    defaultUnit: '°C',
    category: 'lecture',
  },
  {
    key: 'soil_temp_high',
    readingLabel: 'Température sol haute',
    typeLabel: 'Température sol',
    defaultUnit: '°C',
    category: 'lecture',
  },
  {
    key: 'soil_ph',
    readingLabel: 'pH sol',
    typeLabel: 'pH sol',
    defaultUnit: 'pH',
    category: 'lecture',
  },
  {
    key: 'soil_salinity',
    readingLabel: 'Salinité sol',
    typeLabel: 'Salinité',
    defaultUnit: 'mg/l',
    category: 'lecture',
  },
  {
    key: 'soil_conductivity',
    readingLabel: 'Conductivité sol',
    typeLabel: 'Conductivité sol',
    defaultUnit: 'µS/cm',
    category: 'lecture',
  },
  {
    key: 'leaf_temperature',
    readingLabel: 'Température feuille',
    typeLabel: 'Feuille',
    defaultUnit: '°C',
    category: 'lecture',
  },
  {
    key: 'leaf_moisture',
    readingLabel: 'Humidité feuille',
    typeLabel: 'Feuille',
    defaultUnit: '%',
    category: 'lecture',
  },
  {
    key: 'npk_n',
    readingLabel: 'Azote (N)',
    typeLabel: 'NPK',
    defaultUnit: 'mg/kg',
    category: 'lecture',
  },
  {
    key: 'npk_p',
    readingLabel: 'Phosphore (P)',
    typeLabel: 'NPK',
    defaultUnit: 'mg/kg',
    category: 'lecture',
  },
  {
    key: 'npk_k',
    readingLabel: 'Potassium (K)',
    typeLabel: 'NPK',
    defaultUnit: 'mg/kg',
    category: 'lecture',
  },
  {
    key: 'fruit_size',
    readingLabel: 'Taille des fruits',
    typeLabel: 'Fruit',
    defaultUnit: 'mm',
    category: 'lecture',
  },
  {
    key: 'large_fruit_diameter',
    readingLabel: 'Diamètre des fruits',
    typeLabel: 'Fruit',
    defaultUnit: 'mm',
    category: 'lecture',
  },
  {
    key: 'electricity_consumption',
    readingLabel: 'Consommation électrique',
    typeLabel: 'Électricité',
    defaultUnit: 'kWh',
    category: 'lecture',
  },
];

export function getCustomSensorsCatalog(): SensorCatalogItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CUSTOM_SENSORS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SensorCatalogItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s) =>
        typeof s.key === 'string' &&
        typeof s.readingLabel === 'string' &&
        typeof s.typeLabel === 'string' &&
        typeof s.defaultUnit === 'string'
    );
  } catch {
    return [];
  }
}

export function saveCustomSensorsCatalog(rows: SensorCatalogItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CUSTOM_SENSORS_KEY, JSON.stringify(rows));
}

export function getAllSensorsCatalog(
  includeCustom = true
): SensorCatalogItem[] {
  const custom = includeCustom ? getCustomSensorsCatalog() : [];
  const map = new Map<string, SensorCatalogItem>();
  for (const row of SENSOR_CATALOG) map.set(row.key, row);
  for (const row of custom) map.set(row.key, row);
  return Array.from(map.values());
}
