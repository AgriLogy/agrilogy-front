import {
  FARM_MAP_SENSOR_PLACEMENTS_KEY,
  type FarmMapSensorPlacement,
} from '@/app/types/farmMap';

export function loadSensorPlacements(): FarmMapSensorPlacement[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FARM_MAP_SENSOR_PLACEMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is FarmMapSensorPlacement =>
        p &&
        typeof p === 'object' &&
        typeof (p as FarmMapSensorPlacement).id === 'string' &&
        typeof (p as FarmMapSensorPlacement).sectorId === 'string' &&
        typeof (p as FarmMapSensorPlacement).sensorKey === 'string' &&
        typeof (p as FarmMapSensorPlacement).lng === 'number' &&
        typeof (p as FarmMapSensorPlacement).lat === 'number'
    );
  } catch {
    return [];
  }
}

export function saveSensorPlacements(rows: FarmMapSensorPlacement[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FARM_MAP_SENSOR_PLACEMENTS_KEY, JSON.stringify(rows));
}
