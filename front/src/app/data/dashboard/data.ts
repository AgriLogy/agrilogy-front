export interface SensorData {
    formatted_timestamp: string;
    hc_air_temperature: number;
    wetbulb_temperature: number;
    solar_radiation: number;
    vpd: number;
    hc_relative_humidity: number;
    precipitation: number;
    leaf_wetness: number;
    wind_speed: number;
    solar_panel: number;
    battery_voltage: number;
    delta_t: number;
    sunshine_duration: number;
    et0?: number; // ET0 calculated dynamically
  }
  
  // Example data representing values every 10 minutes
  export const data: SensorData[] = [
      {
          formatted_timestamp: "2024-09-13T12:00:00",
          hc_air_temperature: 25,
          wetbulb_temperature: 18,
          solar_radiation: 800,
          vpd: 2,
          hc_relative_humidity: 60,
          precipitation: 0,
          leaf_wetness: 5,
          wind_speed: 3,
          solar_panel: 10,
          battery_voltage: 12,
          delta_t: 5,
          sunshine_duration: 20,
        },
        {
          formatted_timestamp: "2024-09-13T12:10:00",
          hc_air_temperature: 26,
          wetbulb_temperature: 18.5,
          solar_radiation: 820,
          vpd: 2.1,
          hc_relative_humidity: 58,
          precipitation: 0,
          leaf_wetness: 4.8,
          wind_speed: 3.2,
          solar_panel: 11,
          battery_voltage: 12.2,
          delta_t: 5.1,
          sunshine_duration: 22,
        },
        {
          formatted_timestamp: "2024-09-13T12:20:00",
          hc_air_temperature: 27,
          wetbulb_temperature: 19,
          solar_radiation: 830,
          vpd: 2.3,
          hc_relative_humidity: 57,
          precipitation: 0,
          leaf_wetness: 4.5,
          wind_speed: 3.5,
          solar_panel: 12,
          battery_voltage: 12.4,
          delta_t: 5.3,
          sunshine_duration: 23,
        },
        {
          formatted_timestamp: "2024-09-13T12:30:00",
          hc_air_temperature: 28,
          wetbulb_temperature: 19.5,
          solar_radiation: 850,
          vpd: 2.4,
          hc_relative_humidity: 55,
          precipitation: 0,
          leaf_wetness: 4.3,
          wind_speed: 3.7,
          solar_panel: 12.5,
          battery_voltage: 12.5,
          delta_t: 5.4,
          sunshine_duration: 25,
        },
        {
          formatted_timestamp: "2024-09-13T12:40:00",
          hc_air_temperature: 29,
          wetbulb_temperature: 20,
          solar_radiation: 870,
          vpd: 2.6,
          hc_relative_humidity: 54,
          precipitation: 0,
          leaf_wetness: 4.1,
          wind_speed: 3.8,
          solar_panel: 13,
          battery_voltage: 12.6,
          delta_t: 5.5,
          sunshine_duration: 27,
        },
        {
          formatted_timestamp: "2024-09-13T12:50:00",
          hc_air_temperature: 29.5,
          wetbulb_temperature: 20.2,
          solar_radiation: 880,
          vpd: 2.7,
          hc_relative_humidity: 53,
          precipitation: 0,
          leaf_wetness: 3.9,
          wind_speed: 4,
          solar_panel: 13.2,
          battery_voltage: 12.7,
          delta_t: 5.6,
          sunshine_duration: 28,
        },
        {
          formatted_timestamp: "2024-09-13T13:00:00",
          hc_air_temperature: 30,
          wetbulb_temperature: 20.5,
          solar_radiation: 890,
          vpd: 2.8,
          hc_relative_humidity: 52,
          precipitation: 0,
          leaf_wetness: 3.7,
          wind_speed: 4.1,
          solar_panel: 13.4,
          battery_voltage: 12.8,
          delta_t: 5.7,
          sunshine_duration: 29,
        },
        {
          formatted_timestamp: "2024-09-13T13:00:00",
          hc_air_temperature: 30,
          wetbulb_temperature: 20.5,
          solar_radiation: 890,
          vpd: 2.8,
          hc_relative_humidity: 52,
          precipitation: 0,
          leaf_wetness: 3.7,
          wind_speed: 4.1,
          solar_panel: 13.4,
          battery_voltage: 12.8,
          delta_t: 5.7,
          sunshine_duration: 29,
        },
  ];