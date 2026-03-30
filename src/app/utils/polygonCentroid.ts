/** Centroid of a closed ring [[lng, lat], ...] (first ring of a polygon). */

function ringArea(ring: number[][]): number {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(a / 2);
}

function ringCentroid(ring: number[][]): [number, number] {
  let twice = 0;
  let x = 0;
  let y = 0;
  const n = ring.length;
  if (n < 2) return [ring[0]?.[0] ?? 0, ring[0]?.[1] ?? 0];
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    twice += f;
    x += (ring[j][0] + ring[i][0]) * f;
    y += (ring[j][1] + ring[i][1]) * f;
  }
  if (Math.abs(twice) < 1e-18) return [ring[0][0], ring[0][1]];
  const k = 1 / (3 * twice);
  return [x * k, y * k];
}

export function centroidFromPolygonGeometry(geom: {
  type: string;
  coordinates: unknown;
}): [number, number] | null {
  if (geom.type === 'Polygon' && Array.isArray(geom.coordinates)) {
    const rings = geom.coordinates as number[][][];
    const outer = rings[0];
    if (outer?.length) return ringCentroid(outer);
    return null;
  }
  if (geom.type === 'MultiPolygon' && Array.isArray(geom.coordinates)) {
    const polys = geom.coordinates as number[][][][];
    let best: [number, number] | null = null;
    let bestArea = 0;
    for (const poly of polys) {
      const outer = poly[0];
      if (!outer?.length) continue;
      const area = ringArea(outer);
      if (area > bestArea) {
        bestArea = area;
        best = ringCentroid(outer);
      }
    }
    return best;
  }
  return null;
}
