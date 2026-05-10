import { useColorModeValue } from '@chakra-ui/react';

/**
 * Consistent Recharts axis / grid / muted-series colors for light vs
 * dark UI. Grid lines pick up a very low-saturation brand tint so the
 * dashboards visually belong to the same palette as the antd
 * "Nouvelle notification de zone" modal — without overpowering the
 * data series themselves.
 *
 * - axis  : neutral slate (kept as-is so axis numerals stay legible)
 * - tick  : same neutral slate
 * - grid  : brand 100 (light) / brand 800 (dark), dashed at low
 *           opacity by callers (`themedCartesianGrid`)
 */
export function useChartAxisColors() {
  const axis = useColorModeValue('#64748b', '#94a3b8');
  const tickFill = useColorModeValue('#64748b', '#cbd5e1');
  const mutedSeries = useColorModeValue('#94a3b8', '#718096');
  const grid = useColorModeValue('#d6f0dd', '#114828');
  return { axis, tickFill, mutedSeries, grid };
}
