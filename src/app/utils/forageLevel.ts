/**
 * Borehole (forage) depth-to-water math.
 *
 * The captor reports D(t) = depth to the water surface in metres, displayed
 * as-is (no volume computation). Geometry (all metres):
 * - diam ....... interior diameter of the cylinder
 * - H .......... total borehole depth (for the visual scale)
 * - high ....... depth at or above which the level counts as HIGH
 * - low ........ depth at or below which the level counts as LOW
 *
 * Smaller depth = water closer to the surface = HIGH level.
 */

export interface ForageGeometry {
  diameterM?: number | null;
  /** Total borehole depth H. */
  totalDepthM?: number | null;
  /** HIGH threshold (depth <= high). */
  highM?: number | null;
  /** LOW threshold (depth >= low). */
  lowM?: number | null;
}

export interface ForageResolved {
  diameterM: number | null;
  totalDepthM: number | null;
  highM: number | null;
  lowM: number | null;
  /** True when diameter + total depth are known: proportioned cylinder. */
  isCylinder: boolean;
}

export type ForageStatus = 'high' | 'normal' | 'low' | 'unknown';

const num = (v: number | null | undefined): number | null =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;

export function resolveForage(geom: ForageGeometry): ForageResolved {
  const diameterM = num(geom.diameterM);
  const totalDepthM = num(geom.totalDepthM);
  const highM = num(geom.highM);
  const lowM = num(geom.lowM);
  return {
    diameterM,
    totalDepthM,
    highM,
    lowM,
    isCylinder: diameterM != null && totalDepthM != null,
  };
}

export interface ForagePoint {
  /** Depth to the water surface in metres. */
  depthM: number;
  status: ForageStatus;
  /** Water-column fraction 0..1 for the visual (null when H unknown). */
  fillFraction: number | null;
}

/** Convert one raw captor depth D(t) (m) to depth / status. */
export function depthToForagePoint(
  depthM: number,
  forage: ForageResolved
): ForagePoint | null {
  if (!Number.isFinite(depthM) || depthM < 0) return null;
  let status: ForageStatus = 'unknown';
  if (forage.highM != null && depthM <= forage.highM) status = 'high';
  else if (forage.lowM != null && depthM >= forage.lowM) status = 'low';
  else if (forage.highM != null || forage.lowM != null) status = 'normal';
  const fillFraction =
    forage.totalDepthM != null && forage.totalDepthM > 0
      ? Math.min(
          1,
          Math.max(0, (forage.totalDepthM - depthM) / forage.totalDepthM)
        )
      : null;
  return { depthM, status, fillFraction };
}

/** Raw sensor value (cm|m via default_unit) -> metres. */
export function rawToMetres(
  value: number,
  defaultUnit?: string | null
): number {
  const u = (defaultUnit ?? 'm').trim().toLowerCase();
  if (u === 'cm') return value / 100;
  if (u === 'mm') return value / 1000;
  return value;
}
