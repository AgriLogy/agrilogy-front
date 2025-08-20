export interface AlertProps {
	alert: {
	  name: string;
	  type: string;
	  condition: string; // For example: "<=", ">", etc.
	  value: number; // The threshold value for the alert
	  description: string;
	  created_at: string; // Date when the alert was created
	};
  }

  export interface Zone {
  id: number;
  name: string;
  space: number;
  plant_type: string;
  soil_type: string;
  kc: number;
  irrigation_method: string;
  et0: number;
  last_irrigation_date: string; // ISO format e.g., '2025-08-15'
}

export interface ZoneWrapper {
	id: number;
	user: number;
	zone: Zone;
  }

export interface SensorData {
  id: number;
  value: number;
  timestamp: string;
  color: string;
  courbe_name: string;
  default_unit: string;
  available_units: string[];
}

export interface NpkSensorData {
  id: number;
  timestamp: string;
  zone: number;
  user: number;
  nitrogen_value: number;
  nitrogen_color: string;
  nitrogen_courbe_name: string;
  phosphorus_value: number;
  phosphorus_color: string;
  phosphorus_courbe_name: string;
  potassium_value: number;
  potassium_color: string;
  potassium_courbe_name: string;
  default_unit: string;
  available_units: string[];
}


export interface  WeatherData {
  id: number;
  timestamp: string;
  default_unit: string;
  available_units: string[];
  value: number;
  zone: number;
  user: number;
}

export interface WaterSoilData {
  timestamp: string;
  soilLow?: number;
  soilMedium?: number;
  soilHigh?: number;
  waterFlow?: number;
}


// Zones
export interface ZoneType {
  id: number;
  name: string;
  space: number;
  kc: number;
  soil_type: "clay" | "loamy" | "sandy" | "others";
  critical_moisture_threshold: number;
}

export interface ZoneCardType {
  zone: Zone;
  onClick?: () => void;
}