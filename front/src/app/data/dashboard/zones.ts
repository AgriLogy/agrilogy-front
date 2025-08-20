// interface Zone {
//   id: number;
//   name: string;
//   space: number;
//   kc: number;
//   soil_type: "clay" | "loamy" | "sandy" | "others";
//   critical_moisture_threshold: number;
// }

import { Zone } from "@/app/types";

  
  // export const zonesLst: Zone[] = [
  // { id: 1, name: 'Zone 1', space: 100, kc: 0.8, soil_type: "clay", critical_moisture_threshold: 30 },
  // { id: 2, name: 'Zone 2', space: 120, kc: 0.7, soil_type: "loamy", critical_moisture_threshold: 28 },
  // { id: 3, name: 'Zone 3', space: 90, kc: 0.9, soil_type: "sandy", critical_moisture_threshold: 25 },
  // { id: 4, name: 'Zone 4', space: 110, kc: 0.85, soil_type: "others", critical_moisture_threshold: 32 },
  // ];
    

export const zonesLst: Zone[] = [
  {
    id: 1,
    name: 'Zone 1',
    space: 100,
    plant_type: 'Tomates',
    soil_type: 'argileux',
    kc: 0.8,
    irrigation_method: 'Goutte-à-goutte',
    et0: 5.2,
    last_irrigation_date: '2025-08-18'
  },
  {
    id: 2,
    name: 'Zone 2',
    space: 120,
    plant_type: 'Laitue',
    soil_type: 'limoneux',
    kc: 0.7,
    irrigation_method: 'Arroseur',
    et0: 4.9,
    last_irrigation_date: '2025-08-17'
  },
  {
    id: 3,
    name: 'Zone 3',
    space: 90,
    plant_type: 'Maïs',
    soil_type: 'sableux',
    kc: 0.9,
    irrigation_method: 'Pivot central',
    et0: 6.1,
    last_irrigation_date: '2025-08-16'
  },
  {
    id: 4,
    name: 'Zone 4',
    space: 110,
    plant_type: 'Blé',
    soil_type: 'limono-argileux',
    kc: 0.85,
    irrigation_method: 'Irrigation par inondation',
    et0: 5.0,
    last_irrigation_date: '2025-08-15'
  }
];
