// export interface SensorData {
//     formatted_timestamp: string;
//     hc_air_temperature: number;
//     wetbulb_temperature: number;
//     solar_radiation: number;
//     vpd: number;
//     relative_humidity: number;
//     solar_panel_voltage : number;
//     precipitation: number;
//     leaf_wetness: number;
//     wind_speed: number;
//     solar_panel: number;
//     battery_voltage: number;
//     delta_t: number;
//     sunshine_duration: number;
//     et0?: number; // ET0 calculated dynamically
//   }
  
export interface SensorData {
  user: string; // Assuming user is a string representation (like a username or user ID)
  timestamp: string; // ISO string representation of the date and time
  precipitation_rate: number; // Precipitation rate in mm/h
  humidity_weather: number; // Humidity from the weather sensor as a percentage
  wind_speed: number; // Wind speed in m/s
  solar_radiation: number; // Solar radiation in W/m²
  pressure_weather: number; // Atmospheric pressure in hPa
  wind_direction: number; // Wind direction in degrees
  temperature_weather: number; // Air temperature in Celsius
  ec_soil_medium: number; // Electrical conductivity of soil at medium depth in dS/m
  soil_temperature_medium: number; // Soil temperature at medium depth in Celsius
  soil_ec_high: number; // Electrical conductivity of soil at high depth in dS/m
  ec_soil_low: number; // Electrical conductivity of soil at low depth in dS/m
  soil_moisture_medium: number; // Soil moisture at medium depth in percentage
  soil_moisture_high: number; // Soil moisture at high depth in percentage
  soil_moisture_low: number; // Soil moisture at low depth in percentage
  ph_soil: number; // Soil pH level
  soil_temperature_low: number; // Soil temperature at low depth in Celsius
  soil_temperature_high: number; // Soil temperature at high depth in Celsius
  et0?: number; // ET0 calculated dynamically
}
