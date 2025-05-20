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
	kc: number;
	soil_type: "clay" | "loamy" | "sandy" | "others";
	critical_moisture_threshold: number;
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
