/**
 * Shared axis styling and formatters for Recharts.
 * Use for consistent, modern, readable X/Y axes across all charts.
 */
import { formatNumber } from './formatNumber';

// —— Axis design: minimal, thin lines, subtle grid ———
const AXIS_STROKE = '#94a3b8';
const AXIS_STROKE_WIDTH = 1;
const GRID_STROKE = '#e2e8f0';
const TICK_FONT_SIZE = 12;
const TICK_FILL = '#64748b';
const FONT_FAMILY = 'system-ui, -apple-system, sans-serif';

export const chartAxisStyles = {
  axisStroke: AXIS_STROKE,
  axisStrokeWidth: AXIS_STROKE_WIDTH,
  gridStroke: GRID_STROKE,
  tickFontSize: TICK_FONT_SIZE,
  tickFill: TICK_FILL,
  fontFamily: FONT_FAMILY,
} as const;

/** Props to spread on CartesianGrid for subtle grid lines */
export const defaultCartesianGridProps = {
  stroke: GRID_STROKE,
  strokeDasharray: '3 3',
  strokeWidth: 1,
  vertical: true,
  horizontal: true,
};

/**
 * Default Line props: smooth continuous line, no dots by default.
 * A single small marker appears only on hover (activeDot). Thin stroke for a modern look.
 */
export const defaultLineProps = {
  dot: false,
  activeDot: { r: 4, strokeWidth: 2, fill: 'white' },
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Format a timestamp for X-axis display as date + hour: "DD MMM HH:mm" (e.g. "12 Mar 14:00").
 * Ensures both date and time are visible on time-based charts.
 * @param value - ISO timestamp or date string
 */
export function formatXAxisTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Tooltip cursor: subtle vertical line on hover. */
export const defaultTooltipCursor = { stroke: GRID_STROKE, strokeWidth: 1 };

/**
 * Create an X-axis tick formatter for time-based data.
 * Formats each tick as "DD MMM HH:mm" (e.g. "12 Mar 14:00").
 */
export function createXAxisTimeFormatter(
  _data: Array<{ timestamp?: string; name?: string }>,
  _dataKey: 'timestamp' | 'name' = 'timestamp'
): (value: string) => string {
  return (value: string) => formatXAxisTimestamp(value);
}

/**
 * Format period strings (e.g. "2024-01-15", "2024-W03") for X-axis when not full timestamp.
 */
export function formatXAxisPeriod(value: string): string {
  if (!value) return value;
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  }
  return value;
}

/**
 * Y-axis tick formatter: 1–2 decimals, no floating-point artifacts.
 */
export function formatYAxisTick(value: number, decimals: number = 2): string {
  if (value == null || Number.isNaN(value)) return '—';
  return formatNumber(value, decimals);
}

/**
 * Default XAxis props for time-based charts (dataKey timestamp or name).
 * Use tickFormatter with createXAxisTimeFormatter(data, dataKey).
 */
/**
 * Default XAxis props for time-based charts: shows date + hour (e.g. "12 Mar 14:00").
 * Use margin {{ bottom: 40 }} or more so rotated labels fit. dataKey is 'timestamp' or 'name'.
 */
export function getDefaultXAxisProps(
  data: Array<{ timestamp?: string; name?: string }>,
  dataKey: 'timestamp' | 'name' = 'timestamp'
) {
  return {
    stroke: AXIS_STROKE,
    strokeWidth: AXIS_STROKE_WIDTH,
    tick: {
      fill: TICK_FILL,
      fontSize: TICK_FONT_SIZE,
      fontFamily: FONT_FAMILY,
    },
    axisLine: { stroke: AXIS_STROKE, strokeWidth: AXIS_STROKE_WIDTH },
    tickLine: { stroke: AXIS_STROKE, strokeWidth: AXIS_STROKE_WIDTH },
    tickFormatter: createXAxisTimeFormatter(data, dataKey),
    angle: -25,
    textAnchor: 'end' as const,
    interval: 'preserveStartEnd' as const,
    minTickGap: 36,
  };
}

/**
 * XAxis props for period-based charts (e.g. period = "2024-01-15" or "2024-W03").
 */
export function getPeriodXAxisProps() {
  return {
    stroke: AXIS_STROKE,
    strokeWidth: AXIS_STROKE_WIDTH,
    tick: {
      fill: TICK_FILL,
      fontSize: TICK_FONT_SIZE,
      fontFamily: FONT_FAMILY,
    },
    axisLine: { stroke: AXIS_STROKE, strokeWidth: AXIS_STROKE_WIDTH },
    tickLine: { stroke: AXIS_STROKE, strokeWidth: AXIS_STROKE_WIDTH },
    tickFormatter: formatXAxisPeriod,
    interval: 'preserveStartEnd' as const,
    minTickGap: 24,
  };
}

/**
 * Default YAxis props. decimals: 1–2 for readable numeric ticks (no unit on ticks; use YAxis label for unit).
 */
export function getDefaultYAxisProps(decimals: number = 2) {
  return {
    stroke: AXIS_STROKE,
    strokeWidth: AXIS_STROKE_WIDTH,
    tick: {
      fill: TICK_FILL,
      fontSize: TICK_FONT_SIZE,
      fontFamily: FONT_FAMILY,
    },
    axisLine: { stroke: AXIS_STROKE, strokeWidth: AXIS_STROKE_WIDTH },
    tickLine: { stroke: AXIS_STROKE, strokeWidth: AXIS_STROKE_WIDTH },
    tickFormatter: (v: number) => formatYAxisTick(v, decimals),
    width: 48,
    tickMargin: 8,
  };
}
