/**
 * Ray-casting point-in-polygon (lng/lat), outer ring only for Polygon.
 */

function pointInRing(lng: number, lat: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const denom = yj - yi;
    if (Math.abs(denom) < 1e-12) continue;
    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / denom + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function pointInPolygonGeometry(
  lng: number,
  lat: number,
  geometry: { type: string; coordinates: unknown }
): boolean {
  if (geometry.type === 'Polygon' && Array.isArray(geometry.coordinates)) {
    const rings = geometry.coordinates as number[][][];
    if (!rings[0]) return false;
    return pointInRing(lng, lat, rings[0]);
  }
  if (geometry.type === 'MultiPolygon' && Array.isArray(geometry.coordinates)) {
    const polys = geometry.coordinates as number[][][][];
    for (const poly of polys) {
      const outer = poly[0];
      if (outer && pointInRing(lng, lat, outer)) return true;
    }
  }
  return false;
}
