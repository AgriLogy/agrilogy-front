/**
 * Correspondance clé catalogue → endpoint API `/api/sensors/.../` (GET, params date + zone).
 * Les clés sans endpoint dédié restent à compléter côté backend.
 */
export type NpkComponent = 'n' | 'p' | 'k';

export type SensorEndpointSpec =
  | { kind: 'single'; path: string }
  | { kind: 'firstNonEmpty'; paths: string[] }
  | {
      kind: 'npk';
      path: string;
      component: NpkComponent;
    };

const SPECS: Record<string, SensorEndpointSpec> = {
  solar_radiation: { kind: 'single', path: '/api/sensors/solarradiation/' },
  temperature_weather: {
    kind: 'single',
    path: '/api/sensors/temperatureweather/',
  },
  humidity_weather: { kind: 'single', path: '/api/sensors/humidityweather/' },
  pressure_weather: {
    kind: 'single',
    path: '/api/sensors/pressureweather/',
  },
  wind_speed: { kind: 'single', path: '/api/sensors/windspeed/' },
  wind_gust: { kind: 'single', path: '/api/sensors/windgust/' },
  wind_direction: { kind: 'single', path: '/api/sensors/winddirection/' },
  et0: {
    kind: 'firstNonEmpty',
    paths: ['/api/sensors/et0weather/', '/api/sensors/et0calculated/'],
  },
  vpd: { kind: 'single', path: '/api/sensors/vpd/' },
  precipitation_rate: {
    kind: 'single',
    path: '/api/sensors/precipitationrate/',
  },
  water_flow: { kind: 'single', path: '/api/sensors/waterflow/' },
  irrigation_cumulative: {
    kind: 'single',
    path: '/api/sensors/irrigationcumulative/',
  },
  water_level: { kind: 'single', path: '/api/sensors/waterlevel/' },
  water_pressure: { kind: 'single', path: '/api/sensors/waterpressure/' },
  water_ph: { kind: 'single', path: '/api/sensors/phwater/' },
  water_ec: { kind: 'single', path: '/api/sensors/waterec/' },
  soil_moisture_low: { kind: 'single', path: '/api/sensors/soilmoisturelow/' },
  soil_moisture_medium: {
    kind: 'single',
    path: '/api/sensors/soilmoisturemedium/',
  },
  soil_moisture_high: {
    kind: 'single',
    path: '/api/sensors/soilmoisturehigh/',
  },
  soil_temp_low: { kind: 'single', path: '/api/sensors/soiltemperaturelow/' },
  soil_temp_medium: {
    kind: 'single',
    path: '/api/sensors/soiltemperaturemedium/',
  },
  soil_temp_high: {
    kind: 'single',
    path: '/api/sensors/soiltemperaturehigh/',
  },
  soil_ph: { kind: 'single', path: '/api/sensors/phsoil/' },
  soil_salinity: { kind: 'single', path: '/api/sensors/soilsalinity/' },
  soil_conductivity: {
    kind: 'single',
    path: '/api/sensors/soilconductivity/',
  },
  leaf_temperature: {
    kind: 'single',
    path: '/api/sensors/leaftemperature/',
  },
  leaf_moisture: { kind: 'single', path: '/api/sensors/leafmoisture/' },
  npk_n: { kind: 'npk', path: '/api/sensors/npk/', component: 'n' },
  npk_p: { kind: 'npk', path: '/api/sensors/npk/', component: 'p' },
  npk_k: { kind: 'npk', path: '/api/sensors/npk/', component: 'k' },
  fruit_size: { kind: 'single', path: '/api/sensors/fruitsize/' },
  large_fruit_diameter: {
    kind: 'single',
    path: '/api/sensors/largefruitdiameter/',
  },
  electricity_consumption: {
    kind: 'single',
    path: '/api/sensors/electricityconsumption/',
  },
};

export function getSensorEndpointSpec(
  sensorKey: string
): SensorEndpointSpec | null {
  return SPECS[sensorKey] ?? null;
}
