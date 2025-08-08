interface Zone {
  id: number;
  name: string;
  space: number;
  kc: number;
  soil_type: "clay" | "loamy" | "sandy" | "others";
  critical_moisture_threshold: number;
}
  
  export const zonesLst: Zone[] = [
  { id: 1, name: 'Zone 1', space: 100, kc: 0.8, soil_type: "clay", critical_moisture_threshold: 30 },
  { id: 2, name: 'Zone 2', space: 120, kc: 0.7, soil_type: "loamy", critical_moisture_threshold: 28 },
  { id: 3, name: 'Zone 3', space: 90, kc: 0.9, soil_type: "sandy", critical_moisture_threshold: 25 },
  { id: 4, name: 'Zone 4', space: 110, kc: 0.85, soil_type: "others", critical_moisture_threshold: 32 },
  ];
    