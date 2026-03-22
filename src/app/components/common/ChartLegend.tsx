'use client';

import React from 'react';

export type LegendIconShape = 'line' | 'square' | 'circle' | 'rect';

export const DEFAULT_LEGEND_FONT_SIZE = 14;
export const DEFAULT_LEGEND_ICON_SIZE = 12;
export const DEFAULT_LEGEND_ICON_SHAPE: LegendIconShape = 'line';

export interface ChartLegendPayloadEntry {
  value: string;
  color: string;
  dataKey?: string;
  [key: string]: unknown;
}

export interface ChartLegendProps {
  payload?: ChartLegendPayloadEntry[];
  /** Font size of legend labels (default: 14) */
  fontSize?: number;
  /** Size of the icon square/circle, or width for line (default: 12) */
  iconSize?: number;
  /** Icon shape: 'line' | 'square' | 'circle' | 'rect' (default: 'line') */
  iconShape?: LegendIconShape;
  /** Called when a legend item is clicked (e.g. to toggle series visibility). Receives the payload entry. */
  onClick?: (entry: ChartLegendPayloadEntry) => void;
}

/**
 * Shared legend for Recharts charts. Use with:
 *   <Legend wrapperStyle={defaultLegendWrapperStyle} content={<ChartLegend />} />
 * Optional: pass onClick for click-to-toggle, or fontSize/iconSize/iconShape to customize.
 */
const ChartLegend = ({
  payload,
  fontSize = DEFAULT_LEGEND_FONT_SIZE,
  iconSize = DEFAULT_LEGEND_ICON_SIZE,
  iconShape = DEFAULT_LEGEND_ICON_SHAPE,
  onClick,
}: ChartLegendProps) => {
  return (
    <ul
      style={{
        display: 'flex',
        listStyle: 'none',
        padding: 0,
        flexWrap: 'wrap',
        margin: 0,
        gap: 16,
      }}
    >
      {payload?.map((entry, index) => (
        <li
          key={`legend-${index}`}
          style={{
            fontSize,
            color: entry.color,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: onClick ? 'pointer' : undefined,
          }}
          onClick={() => onClick?.(entry)}
          onKeyDown={(e) => {
            if (onClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onClick(entry);
            }
          }}
          role={onClick ? 'button' : undefined}
          tabIndex={onClick ? 0 : undefined}
        >
          <span
            style={{
              backgroundColor: entry.color,
              width: iconShape === 'line' ? iconSize * 2 : iconSize,
              height: iconShape === 'line' ? 3 : iconSize,
              display: 'inline-block',
              borderRadius: iconShape === 'circle' ? '50%' : 0,
            }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export default ChartLegend;
