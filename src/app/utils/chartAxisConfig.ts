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

/** Hover marker: small circle, white fill, stroke for visibility. Use for Line activeDot. */
export const defaultActiveDot = { r: 4, strokeWidth: 2, fill: 'white' };

/**
 * Default Line props: smooth continuous line, no dots by default.
 * A single small marker appears only on hover (activeDot). Thin stroke for a modern look.
 */
export const defaultLineProps = {
  dot: false,
  activeDot: defaultActiveDot,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/**
 * Default Bar props: rounded corners, no outline, modern density.
 * Spread this on Recharts <Bar /> for consistent styling.
 */
export const defaultBarProps = {
  radius: [8, 8, 2, 2] as [number, number, number, number],
  stroke: 'none',
  isAnimationActive: false,
} as const;

/** Legend wrapper style for centered placement below chart (use with Recharts Legend wrapperStyle). */
export const defaultLegendWrapperStyle = {
  paddingTop: 8,
  marginBottom: 0,
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
} as const;

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

/** Format a timestamp for X-axis display as date only: "DD MMM" (e.g. "12 Mar"). */
export function formatXAxisDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

const pad2 = (n: number) => n.toString().padStart(2, '0');

/**
 * When zoomed to a short window (e.g. one day), format X ticks like the soil graph mock:
 * - First tick: date only ("1 Jun")
 * - Middle ticks: time only ("00:00", "01:00", …)
 * - Last tick: date ("2 Jun") if the range crosses into another calendar day; otherwise time
 * - First tick of a new calendar day (vs previous tick): date label
 */
export function formatZoomedTimeAxisTick(value: string, allTicks: string[]): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime()) || allTicks.length === 0) return String(value);

  let idx = allTicks.indexOf(value);
  if (idx === -1) {
    idx = allTicks.findIndex((t) => Math.abs(new Date(t).getTime() - d.getTime()) < 1);
  }
  if (idx === -1) return formatXAxisTimestamp(value);

  const firstD = new Date(allTicks[0]);

  if (idx === 0) {
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }

  if (idx === allTicks.length - 1) {
    const sameCalDayAsStart =
      d.getFullYear() === firstD.getFullYear() &&
      d.getMonth() === firstD.getMonth() &&
      d.getDate() === firstD.getDate();
    if (sameCalDayAsStart) {
      return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    }
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }

  const prevD = new Date(allTicks[idx - 1]);
  const newCalendarDay =
    d.getDate() !== prevD.getDate() ||
    d.getMonth() !== prevD.getMonth() ||
    d.getFullYear() !== prevD.getFullYear();

  if (newCalendarDay) {
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }

  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Same rules as {@link formatZoomedTimeAxisTick} for numeric `type="number"` X-axes (ms since epoch). */
export function formatZoomedTimeAxisTickMs(valueMs: number, allTicksMs: number[]): string {
  const d = new Date(valueMs);
  if (Number.isNaN(d.getTime()) || allTicksMs.length === 0) return '';

  const idx = allTicksMs.findIndex((t) => Math.abs(t - valueMs) < 1);
  if (idx === -1) {
    return formatXAxisTimestamp(new Date(valueMs).toISOString());
  }

  const tickStrings = allTicksMs.map((ms) => new Date(ms).toISOString());
  return formatZoomedTimeAxisTick(new Date(valueMs).toISOString(), tickStrings);
}

/** Recharts category axes need exact string matches; use this + `type="number"` + {@link CHART_TIME_MS_KEY} for hourly ticks. */
export const CHART_TIME_MS_KEY = 'timeMs';

export function addTimeMsToChartRows<T extends object>(
  rows: T[],
  timestampKey: string
): Array<T & { [CHART_TIME_MS_KEY]: number }> {
  return rows.map((row) => {
    const raw = (row as Record<string, unknown>)[timestampKey];
    const ms =
      typeof raw === 'string' || typeof raw === 'number'
        ? new Date(raw).getTime()
        : NaN;
    return {
      ...row,
      [CHART_TIME_MS_KEY]: Number.isFinite(ms) ? ms : 0,
    };
  });
}

function getTimeMsRangeFromData(
  data: Array<object>,
  dataKey: string
): { minMs: number; maxMs: number } | null {
  const msList: number[] = [];
  for (const row of data) {
    const v = (row as Record<string, unknown>)[dataKey];
    if (v == null) continue;
    const ms = new Date(v as string | number).getTime();
    if (!Number.isNaN(ms)) msList.push(ms);
  }
  if (msList.length === 0) return null;
  return { minMs: Math.min(...msList), maxMs: Math.max(...msList) };
}

const axisLineStyle = {
  stroke: AXIS_STROKE,
  strokeWidth: AXIS_STROKE_WIDTH,
};

/** Visual props shared by category and numeric time X-axes */
function getTimeAxisVisualProps() {
  return {
    stroke: AXIS_STROKE,
    strokeWidth: AXIS_STROKE_WIDTH,
    tick: {
      fill: TICK_FILL,
      fontSize: TICK_FONT_SIZE,
      fontFamily: FONT_FAMILY,
    },
    axisLine: axisLineStyle,
    tickLine: axisLineStyle,
  };
}

/** Tooltip cursor: subtle vertical line on hover. */
export const defaultTooltipCursor = { stroke: GRID_STROKE, strokeWidth: 1 };

/**
 * Create an X-axis tick formatter for time-based data.
 * Formats each tick as "DD MMM HH:mm" (e.g. "12 Mar 14:00").
 */
export function createXAxisTimeFormatter(
  _data: Array<object>,
  _dataKey: string = 'timestamp'
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
  data: Array<object>,
  dataKey: string = 'timestamp'
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

export type AdaptiveTimeXAxisOptions = {
  /** Optional slice of `data` (by index) used to compute visible time span for tick density. */
  startIndex?: number;
  endIndex?: number;
  /** Show date+time (DD MMM HH:mm) when visible span is <= this many hours. Default: 7 days. */
  zoomThresholdHours?: number;
};

/** Hourly (or stepped) tick positions in ms for Recharts `type="number"` X-axis. */
function generateTimeTicksMs(startMs: number, endMs: number, stepMs: number): number[] {
  const step = Math.max(stepMs, 60 * 60 * 1000);
  const ticks: number[] = [];
  for (let t = startMs; t <= endMs; t += step) {
    ticks.push(t);
  }
  if (ticks.length === 0 || ticks[ticks.length - 1] < endMs) {
    if (ticks.length === 0 || ticks[ticks.length - 1] !== endMs) {
      ticks.push(endMs);
    }
  }
  return ticks;
}

/**
 * Adaptive X-axis for time-series:
 * - Wide windows: category axis, "DD MMM"
 * - Zoomed/small windows: **numeric** `timeMs` axis so hourly ticks render (Recharts category axes ignore mismatched tick strings)
 */
export function getAdaptiveTimeXAxisProps(
  data: Array<object>,
  dataKey: string = 'timestamp',
  options: AdaptiveTimeXAxisOptions = {}
) {
  const visual = getTimeAxisVisualProps();
  const zoomThresholdHours = options.zoomThresholdHours ?? 24 * 7;
  const thresholdMs = zoomThresholdHours * 60 * 60 * 1000;

  const range = getTimeMsRangeFromData(data, dataKey);
  const spanMs = range ? range.maxMs - range.minMs : Number.POSITIVE_INFINITY;
  const zoomed = range != null && spanMs <= thresholdMs && data.length > 0;

  if (zoomed && range) {
    const { minMs, maxMs } = range;
    const spanHours = spanMs / (60 * 60 * 1000);
    const stepHours =
      spanHours <= 12 ? 1 : spanHours <= 24 ? 2 : spanHours <= 48 ? 3 : spanHours <= 96 ? 4 : 6;
    const stepMsVal = stepHours * 60 * 60 * 1000;
    const ticksMs = generateTimeTicksMs(minMs, maxMs, stepMsVal);

    let domainMin = minMs;
    let domainMax = maxMs;
    if (domainMin === domainMax) {
      const pad = 60 * 60 * 1000;
      domainMin -= pad;
      domainMax += pad;
    }

    return {
      ...visual,
      type: 'number' as const,
      dataKey: CHART_TIME_MS_KEY,
      domain: [domainMin, domainMax] as [number, number],
      ticks: ticksMs,
      tickFormatter: (v: number) => formatZoomedTimeAxisTickMs(v, ticksMs),
      allowDecimals: false,
      interval: 0,
      minTickGap: 0,
      angle: -35,
      textAnchor: 'end' as const,
    };
  }

  const base = getDefaultXAxisProps(data, dataKey);
  return {
    ...base,
    dataKey,
    tickFormatter: (v: string) => formatXAxisDate(v),
    interval: 'preserveStartEnd' as const,
    minTickGap: 36,
    angle: 0,
    textAnchor: 'middle' as const,
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
