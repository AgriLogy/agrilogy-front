import { FARM_SECTORS_STORAGE_KEY } from '@/app/types/farmMap';

export interface FarmSectorsFeatureCollection {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    id?: string | number;
    geometry: { type: string; coordinates: unknown };
    properties?: Record<string, unknown> | null;
  }>;
}

function emptyCollection(): FarmSectorsFeatureCollection {
  return { type: 'FeatureCollection', features: [] };
}

export function loadFarmSectorsFromStorage(): FarmSectorsFeatureCollection {
  if (typeof window === 'undefined') return emptyCollection();
  try {
    const raw = localStorage.getItem(FARM_SECTORS_STORAGE_KEY);
    if (!raw) return emptyCollection();
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      (parsed as FarmSectorsFeatureCollection).type === 'FeatureCollection' &&
      Array.isArray((parsed as FarmSectorsFeatureCollection).features)
    ) {
      return parsed as FarmSectorsFeatureCollection;
    }
    return emptyCollection();
  } catch {
    return emptyCollection();
  }
}

export function saveFarmSectorsToStorage(
  fc: FarmSectorsFeatureCollection
): void {
  localStorage.setItem(FARM_SECTORS_STORAGE_KEY, JSON.stringify(fc));
}
