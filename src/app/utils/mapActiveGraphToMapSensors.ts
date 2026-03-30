import type { ActiveGraphResponse } from '@/app/utils/getActiveGraphs';
import {
  MAP_SENSOR_DEFINITIONS,
  type MapSensorDefinition,
} from '@/app/utils/mapSensors';

const DEF_BY_KEY = new Map(
  MAP_SENSOR_DEFINITIONS.map((d) => [d.key, d] as const)
);

function uniqueDefs(keys: string[]): MapSensorDefinition[] {
  const seen = new Set<string>();
  const out: MapSensorDefinition[] = [];
  for (const k of keys) {
    if (seen.has(k)) continue;
    const d = DEF_BY_KEY.get(k);
    if (d) {
      seen.add(k);
      out.push(d);
    }
  }
  return out;
}

/**
 * Même logique que les pages Sol / Plante / Station / Eau : on lit les drapeaux
 * renvoyés par GET /api/active-graph/self/{zone}/ et on expose uniquement les
 * capteurs correspondants sur la carte.
 */
export function activeGraphToMapSensorDefinitions(
  ag: ActiveGraphResponse | null
): MapSensorDefinition[] {
  if (!ag) return [];

  const keys: string[] = [];

  if (ag.soil_irrigation_status) {
    keys.push(
      'soil_moisture_low',
      'soil_moisture',
      'soil_moisture_high',
      'water_flow'
    );
  }
  if (ag.soil_temperature_status) {
    keys.push('soil_temp_low', 'soil_temp', 'soil_temp_high');
  }
  if (ag.soil_ph_status) keys.push('soil_ph');
  if (ag.soil_conductivity_status) {
    keys.push('soil_salinity', 'soil_conductivity');
  }
  if (ag.soil_moisture_status) {
    keys.push('soil_ec_low', 'soil_ec_high', 'water_flow');
  }
  if (ag.npk_status) keys.push('npk');

  if (
    ag.weather_temperature_humidity_status ||
    ag.temperature_humidity_weather_status
  ) {
    keys.push('humidity_weather', 'temperature_weather');
  }
  if (ag.et0_status) keys.push('et0');
  if (ag.wind_speed_status || ag.wind_radar_status) keys.push('wind_speed');
  if (ag.solar_radiation_status) keys.push('solar_radiation');
  if (ag.precipitation_rate_status || ag.precipitation_humidity_rate_status) {
    keys.push('precipitation_rate');
  }
  if (ag.cumulative_precipitation_status) keys.push('precipitation_rate');
  if (ag.fruit_size_status) keys.push('fruit_size');
  if (ag.large_fruit_diameter_status) keys.push('large_fruit_diameter');
  if (ag.leaf_sensor_status) {
    keys.push('leaf_moisture', 'leaf_temp');
  }
  if (ag.water_flow_status) keys.push('water_flow');
  if (ag.water_pressure_status) keys.push('water_pressure');
  if (ag.water_ph_status) keys.push('water_ph');
  if (ag.water_ec_status) keys.push('water_ec');
  if (ag.electricity_consumption_status) {
    keys.push('electricity_consumption');
  }

  return uniqueDefs(keys);
}
