import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '@/app/lib/api';
import type { NpkSensorData, SensorData } from '@/app/types';

/**
 * Même famille que les pages Sol / Plante / Station : séries temporelles ou NPK.
 * `apiPaths` : suffixes avec ou sans « / » final (voir WaterSoilMain vs PhSoilMain).
 */
export type MapSensorDefinition = {
  key: string;
  label: string;
  unitHint: string;
  apiPaths: string[];
  /** Défaut : points type SensorData. `npk` = /api/sensors/npk/ */
  responseFormat?: 'timeseries' | 'npk';
};

/** Variantes d’URL ( WaterSoilMain utilise parfois sans « / » final ). */
function expandPathVariants(paths: string[]): string[] {
  const s = new Set<string>();
  for (const p of paths) {
    const t = p.trim();
    if (!t) continue;
    s.add(t);
    s.add(t.endsWith('/') ? t.slice(0, -1) : `${t}/`);
    if (t.startsWith('/api/')) s.add(t.slice(1));
  }
  return [...s];
}

/** Réponse Django / tableau brut / objet enveloppe. */
export function parseTimeseriesRows(raw: unknown): SensorData[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (r): r is SensorData =>
        r != null &&
        typeof r === 'object' &&
        'timestamp' in r &&
        'value' in r &&
        typeof (r as SensorData).timestamp === 'string'
    );
  }
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    for (const k of ['results', 'data', 'sensor_data']) {
      const inner = o[k];
      const nested = parseTimeseriesRows(inner);
      if (nested.length) return nested;
    }
  }
  return [];
}

export const MAP_SENSOR_DEFINITIONS: MapSensorDefinition[] = [
  {
    key: 'et0',
    label: 'ET₀',
    unitHint: 'mm/j',
    apiPaths: ['/api/sensors/et0weather/', '/api/sensors/et0calculated/'],
  },
  {
    key: 'temperature_weather',
    label: 'Température air',
    unitHint: '°C',
    apiPaths: ['/api/sensors/temperatureweather/'],
  },
  {
    key: 'humidity_weather',
    label: 'Humidité air',
    unitHint: '%',
    apiPaths: ['/api/sensors/humidityweather/'],
  },
  {
    key: 'wind_speed',
    label: 'Vitesse du vent',
    unitHint: 'm/s',
    apiPaths: ['/api/sensors/windspeed/'],
  },
  {
    key: 'solar_radiation',
    label: 'Rayonnement solaire',
    unitHint: 'W/m²',
    apiPaths: ['/api/sensors/solarradiation/'],
  },
  {
    key: 'precipitation_rate',
    label: 'Précipitation',
    unitHint: 'mm/h',
    apiPaths: ['/api/sensors/precipitationrate/'],
  },
  {
    key: 'soil_moisture',
    label: 'Humidité sol (prof. moyenne)',
    unitHint: '%',
    apiPaths: ['/api/sensors/soilmoisturemedium/'],
  },
  {
    key: 'soil_moisture_low',
    label: 'Humidité sol (bas)',
    unitHint: '%',
    apiPaths: ['/api/sensors/soilmoisturelow/'],
  },
  {
    key: 'soil_moisture_high',
    label: 'Humidité sol (haut)',
    unitHint: '%',
    apiPaths: ['/api/sensors/soilmoisturehigh/'],
  },
  {
    key: 'soil_temp',
    label: 'Température sol (moyenne)',
    unitHint: '°C',
    apiPaths: ['/api/sensors/soiltemperaturemedium/'],
  },
  {
    key: 'soil_temp_low',
    label: 'Température sol (bas)',
    unitHint: '°C',
    apiPaths: ['/api/sensors/soiltemperaturelow/'],
  },
  {
    key: 'soil_temp_high',
    label: 'Température sol (haut)',
    unitHint: '°C',
    apiPaths: ['/api/sensors/soiltemperaturehigh/'],
  },
  {
    key: 'water_flow',
    label: 'Débit',
    unitHint: 'L/min',
    apiPaths: ['/api/sensors/waterflow/'],
  },
  {
    key: 'water_pressure',
    label: "Pression d'eau",
    unitHint: 'bar',
    apiPaths: ['/api/sensors/waterpressure/'],
  },
  {
    key: 'soil_ph',
    label: 'pH sol',
    unitHint: '',
    apiPaths: ['/api/sensors/phsoil/'],
  },
  {
    key: 'soil_ec_low',
    label: 'Conductivité sol (bas)',
    unitHint: '',
    apiPaths: ['/api/sensors/ecsoillow/'],
  },
  {
    key: 'soil_ec_high',
    label: 'Conductivité sol (haut)',
    unitHint: '',
    apiPaths: ['/api/sensors/ecsoilhigh/'],
  },
  {
    key: 'soil_salinity',
    label: 'Salinité sol',
    unitHint: '',
    apiPaths: ['/api/sensors/soilsalinity/'],
  },
  {
    key: 'soil_conductivity',
    label: 'Conductivité sol',
    unitHint: '',
    apiPaths: ['/api/sensors/soilconductivity/'],
  },
  {
    key: 'leaf_moisture',
    label: 'Humidité foliaire',
    unitHint: '%',
    apiPaths: ['/api/sensors/leafmoisture/', 'api/sensors/leafmoisture/'],
  },
  {
    key: 'leaf_temp',
    label: 'Température foliaire',
    unitHint: '°C',
    apiPaths: ['/api/sensors/leaftemperature/', 'api/sensors/leaftemperature/'],
  },
  {
    key: 'fruit_size',
    label: 'Calib fruits',
    unitHint: '',
    apiPaths: ['/api/sensors/fruitsize/'],
  },
  {
    key: 'large_fruit_diameter',
    label: 'Diamètre fruit',
    unitHint: '',
    apiPaths: ['/api/sensors/largefruitdiameter/'],
  },
  {
    key: 'npk',
    label: 'NPK (sol)',
    unitHint: '',
    apiPaths: ['/api/sensors/npk/'],
    responseFormat: 'npk',
  },
  {
    key: 'water_ph',
    label: 'pH eau',
    unitHint: '',
    apiPaths: ['/api/sensors/phwater/'],
  },
  {
    key: 'water_ec',
    label: 'EC eau',
    unitHint: '',
    apiPaths: ['/api/sensors/waterec/'],
  },
  {
    key: 'electricity_consumption',
    label: 'Consommation électrique',
    unitHint: '',
    apiPaths: ['/api/sensors/electricityconsumption/'],
  },
];

export function getMapSensorDefinition(
  key: string
): MapSensorDefinition | undefined {
  return MAP_SENSOR_DEFINITIONS.find((d) => d.key === key);
}

export type MapSensorHoverPayload = {
  title: string;
  line: string;
  deltaLine: string | null;
  measuredAt: string | null;
};

function pickSeries(rows: SensorData[]): {
  last: SensorData;
  compare: SensorData | null;
} {
  const sorted = [...rows].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const last = sorted[sorted.length - 1];
  const lastT = new Date(last.timestamp).getTime();
  const dayMs = 86_400_000;
  const target = lastT - dayMs;
  let best: SensorData | null = null;
  let bestDiff = Infinity;
  for (const p of sorted) {
    if (p === last) continue;
    const d = Math.abs(new Date(p.timestamp).getTime() - target);
    if (d < bestDiff) {
      bestDiff = d;
      best = p;
    }
  }
  return { last, compare: best };
}

function formatMeasuredAt(timestamp: string): string | null {
  try {
    return format(new Date(timestamp), 'dd MMM yyyy, HH:mm', { locale: fr });
  } catch {
    return null;
  }
}

async function fetchTimeseriesForDefinition(
  def: MapSensorDefinition,
  params: Record<string, string | number | undefined>
): Promise<SensorData[]> {
  for (const path of expandPathVariants(def.apiPaths)) {
    try {
      const res = await api.get<unknown>(path, { params });
      const series = parseTimeseriesRows(res.data);
      if (series.length) return series;
    } catch {
      /* essai suivant */
    }
  }
  return [];
}

async function fetchNpkPayload(
  def: MapSensorDefinition,
  params: Record<string, string | number | undefined>
): Promise<MapSensorHoverPayload | undefined> {
  for (const path of expandPathVariants(def.apiPaths)) {
    try {
      const res = await api.get<NpkSensorData[]>(path, { params });
      const rows = Array.isArray(res.data) ? res.data : [];
      if (!rows.length) continue;
      const last = rows[rows.length - 1];
      const u = last.default_unit?.trim() || '';
      const n = Number(last.nitrogen_value);
      const p = Number(last.phosphorus_value);
      const k = Number(last.potassium_value);
      const fmt = (x: number) => (Number.isFinite(x) ? x.toFixed(2) : '—');
      const line = `N ${fmt(n)} · P ${fmt(p)} · K ${fmt(k)}${u ? ` ${u}` : ''}`;
      const subNames = [
        last.nitrogen_courbe_name,
        last.phosphorus_courbe_name,
        last.potassium_courbe_name,
      ]
        .filter(Boolean)
        .join(' / ');
      const title = subNames || def.label;
      return {
        title,
        line: `Dernière mesure : ${line}`,
        deltaLine: null,
        measuredAt: formatMeasuredAt(last.timestamp),
      };
    } catch {
      /* suivant */
    }
  }
  return undefined;
}

export function escapeHtmlForPopup(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function fetchMapSensorHoverPayload(
  def: MapSensorDefinition,
  zoneId: number | null
): Promise<MapSensorHoverPayload> {
  const end = new Date().toISOString().split('T')[0];
  const start = new Date(Date.now() - 30 * 86_400_000)
    .toISOString()
    .split('T')[0];
  const params: Record<string, string | number | undefined> = {
    start_date: start,
    end_date: end,
  };
  if (zoneId != null) params.zone = zoneId;

  if (def.responseFormat === 'npk') {
    const npk = await fetchNpkPayload(def, params);
    if (npk) return npk;
    return {
      title: def.label,
      line:
        zoneId == null
          ? 'Sélectionnez une zone API (comme sur la page Sol) pour charger le NPK.'
          : 'Aucune donnée NPK pour cette zone sur la période.',
      deltaLine: null,
      measuredAt: null,
    };
  }

  const series = await fetchTimeseriesForDefinition(def, params);

  if (!series.length) {
    return {
      title: def.label,
      line:
        zoneId == null
          ? 'Sélectionnez une zone API sous la carte.'
          : 'Aucune donnée.',
      deltaLine: null,
      measuredAt: null,
    };
  }

  const { last, compare } = pickSeries(series);
  const courbe =
    typeof last.courbe_name === 'string' ? last.courbe_name.trim() : '';
  const title = courbe || def.label;
  const unit = last.default_unit?.trim() || def.unitHint;
  const val = Number(last.value);
  const valueStr = Number.isFinite(val)
    ? `${val.toFixed(2)}${unit ? ` ${unit}` : ''}`
    : '—';

  const measuredAt = formatMeasuredAt(last.timestamp);

  let deltaLine: string | null = null;
  const lastN = Number(last.value);
  const cmpN = compare != null ? Number(compare.value) : NaN;
  if (
    compare != null &&
    Number.isFinite(lastN) &&
    Number.isFinite(cmpN) &&
    cmpN !== 0
  ) {
    const pct = ((lastN - cmpN) / Math.abs(cmpN)) * 100;
    if (Number.isFinite(pct)) {
      const sign = pct >= 0 ? '+' : '';
      deltaLine = `${sign}${pct.toFixed(2)} % (vs veille)`;
    }
  }

  return {
    title,
    line: `Dernière mesure : ${valueStr}`,
    deltaLine,
    measuredAt,
  };
}
