import { applySensorCalibration } from '@/app/utils/unitOverrides';

/**
 * Same rule as dashboards: valeur affichée = f(valeur brute) puis calibration linéaire.
 * `preTransform` matches any per-sensor API scaling (e.g. solar ÷ 1000) applied before a,b.
 */
export function calibrateChartValue(
  sensorKey: string,
  raw: number,
  preTransform?: (v: number) => number
): number {
  const v = typeof preTransform === 'function' ? preTransform(raw) : raw;
  if (!Number.isFinite(v)) return raw;
  return applySensorCalibration(sensorKey, v);
}
