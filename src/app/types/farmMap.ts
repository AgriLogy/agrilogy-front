/**
 * Farm map domain types and extension points for future layers (v2+):
 * sensors, weather stations, water / irrigation lines, valves / actuators.
 */

export const FARM_SECTORS_STORAGE_KEY = 'agrilogy-farm-sectors-geojson';

/** Placed sensor markers on the farm map (linked to a drawn sector). */
export const FARM_MAP_SENSOR_PLACEMENTS_KEY =
  'agrilogy-farm-map-sensor-placements';

/** Prefix for future dynamic sources/layers (avoid collisions with Draw internals). */
export const FUTURE_AGRILOGY_LAYER_PREFIX = 'agrilogy-v2-';

export const DEFAULT_MAP_STYLES = {
  /** Satellite + labels — primary choice for field / parcel work. */
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  /** Topographic context for boundaries and relief. */
  terrain: 'mapbox://styles/mapbox/outdoors-v12',
} as const;

export type FarmMapStyleId = keyof typeof DEFAULT_MAP_STYLES;

export interface FarmSectorProperties {
  name?: string;
  /** Hook for irrigation zones, sensor ids, etc. */
  meta?: Record<string, unknown>;
}

export type FarmMapSensorPlacement = {
  id: string;
  /** Mapbox Draw feature id of the polygon this sensor belongs to. */
  sectorId: string;
  sensorKey: string;
  lng: number;
  lat: number;
  /** Offset from sector polygon centroid — garde le capteur “collé” à la zone quand le polygone est déplacé/édité. */
  relLng?: number;
  relLat?: number;
  /** API zone id used when fetching live readings (falls back to global zone if missing). */
  zoneId?: number | null;
};
