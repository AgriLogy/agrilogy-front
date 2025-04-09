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