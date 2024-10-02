import { SensorData } from "./data";
export const calculateET0 = (data: SensorData): number => {
  const {
    hc_air_temperature,
    solar_radiation,
    wind_speed,
    hc_relative_humidity,
  } = data;

  const et0 =
    (0.0023 *
      solar_radiation *
      (hc_air_temperature + 17.8) *
      (100 - hc_relative_humidity)) /
    (wind_speed + 1);

  return parseFloat(et0.toFixed(2));
};
