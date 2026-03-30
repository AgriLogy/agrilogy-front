'use client';

import type { IconType } from 'react-icons';
import {
  FaBolt,
  FaFlask,
  FaSeedling,
  FaTint,
  FaWater,
  FaWind,
} from 'react-icons/fa';
import { GiPlantRoots } from 'react-icons/gi';
import {
  WiDaySunny,
  WiHumidity,
  WiRain,
  WiThermometer,
  WiStrongWind,
} from 'react-icons/wi';

const ICONS: Record<string, IconType> = {
  et0: WiRain,
  temperature_weather: WiThermometer,
  humidity_weather: WiHumidity,
  wind_speed: WiStrongWind,
  solar_radiation: WiDaySunny,
  precipitation_rate: WiRain,
  soil_moisture: GiPlantRoots,
  soil_moisture_low: GiPlantRoots,
  soil_moisture_high: GiPlantRoots,
  soil_temp: FaSeedling,
  soil_temp_low: FaSeedling,
  soil_temp_high: FaSeedling,
  water_flow: FaWater,
  water_pressure: FaTint,
  soil_ph: FaFlask,
  soil_ec_low: FaBolt,
  soil_ec_high: FaBolt,
  soil_salinity: FaFlask,
  soil_conductivity: FaBolt,
  leaf_moisture: FaSeedling,
  leaf_temp: WiThermometer,
  fruit_size: FaSeedling,
  large_fruit_diameter: FaSeedling,
  npk: FaFlask,
  water_ph: FaFlask,
  water_ec: FaBolt,
  electricity_consumption: FaBolt,
};

/** Couleurs de pastille (contraste avec icône blanche). */
export const SENSOR_MARKER_BG: Record<string, string> = {
  et0: '#2c5282',
  temperature_weather: '#c05621',
  humidity_weather: '#2b6cb0',
  wind_speed: '#553c9a',
  solar_radiation: '#b7791f',
  precipitation_rate: '#276749',
  soil_moisture: '#744210',
  soil_moisture_low: '#6b4f2c',
  soil_moisture_high: '#8b6914',
  soil_temp: '#285e61',
  soil_temp_low: '#234e52',
  soil_temp_high: '#2c7a7b',
  water_flow: '#2c7a7b',
  water_pressure: '#1a365d',
  soil_ph: '#805ad5',
  soil_ec_low: '#5a4fcf',
  soil_ec_high: '#44337a',
  soil_salinity: '#b83280',
  soil_conductivity: '#4c51bf',
  leaf_moisture: '#276749',
  leaf_temp: '#9c4221',
  fruit_size: '#2f855a',
  large_fruit_diameter: '#2f855a',
  npk: '#6b46c1',
  water_ph: '#2c5282',
  water_ec: '#285e61',
  electricity_consumption: '#744210',
};

export function markerBackgroundForSensor(sensorKey: string): string {
  return SENSOR_MARKER_BG[sensorKey] ?? '#3182ce';
}

export function FarmMapSensorMarkerIcon({
  sensorKey,
  size = 20,
  color = '#ffffff',
}: {
  sensorKey: string;
  size?: number;
  /** Pastille carte : blanc ; palette choix : ex. #2B6CB0 */
  color?: string;
}) {
  const Icon = ICONS[sensorKey] ?? FaBolt;
  return <Icon size={size} color={color} aria-hidden />;
}
