import { SensorData } from './data';

export const calculateET0 = (data: SensorData): number => {
  const solar_radiation = data.solar_radiation;
  const wind_speed = data.wind_speed;
  const hc_air_temperature =
    data.hc_air_temperature ?? data.temperature_weather;
  const hc_relative_humidity =
    data.hc_relative_humidity ?? data.humidity_weather;

  const et0 =
    (0.0023 *
      solar_radiation *
      (hc_air_temperature + 17.8) *
      (100 - hc_relative_humidity)) /
    (wind_speed + 1);

  return parseFloat(et0.toFixed(2));
};
