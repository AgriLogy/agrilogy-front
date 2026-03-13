'use client';

import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { formatNumber } from '@/app/utils/formatNumber';
import { formatXAxisTimestamp } from '@/app/utils/chartAxisConfig';

/**
 * Recharts payload item passed to tooltip content.
 * @see https://recharts.org/en-US/api/Tooltip#content
 */
export interface UnifiedTooltipPayloadItem {
  name?: string;
  value?: number | string;
  dataKey?: string;
  color?: string;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Props passed by Recharts to custom Tooltip content.
 */
export interface UnifiedTooltipPropsFromRecharts {
  active?: boolean;
  payload?: UnifiedTooltipPayloadItem[];
  label?: string;
}

/**
 * Optional formatters and display options for UnifiedTooltip.
 * Pass these when using <Tooltip content={<UnifiedTooltip ... />} />.
 */
export interface UnifiedTooltipCustomProps {
  /** Format the label (e.g. x-axis value like timestamp or period). */
  labelFormatter?: (label: string) => string;
  /**
   * Format a single value. Receives value, series name, and full payload item.
   * Return the string to display (e.g. "12.5 %", "100 mm").
   */
  valueFormatter?: (
    value: number | string,
    name: string,
    item: UnifiedTooltipPayloadItem
  ) => string;
  /** Optional unit suffix applied when no valueFormatter is provided (e.g. " %", " mm", " kPa"). */
  valueUnit?: string;
  /** Optional label shown above the values (e.g. "Date", "Timestamp"). If not set, the raw label is shown. */
  labelTitle?: string;
}

export type UnifiedTooltipProps = UnifiedTooltipPropsFromRecharts &
  UnifiedTooltipCustomProps;

/**
 * Default formatter for the label: format timestamps as "DD MMM HH:mm", else as-is.
 */
function defaultLabelFormatter(label: string): string {
  const s = String(label ?? '');
  if (!s) return s;
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return formatXAxisTimestamp(s);
  return s;
}

/**
 * Default formatter for a value: optional unit suffix, otherwise String(value).
 */
function defaultValueFormatter(
  value: number | string,
  _name: string,
  _item: UnifiedTooltipPayloadItem,
  valueUnit?: string
): string {
  if (value == null) return '—';
  const num = typeof value === 'number' ? value : Number(value);
  const str = Number.isNaN(num) ? String(value) : formatNumber(num);
  return valueUnit ? `${str}${valueUnit}` : str;
}

/**
 * Unified tooltip for all Recharts-based charts (LineChart, BarChart, AreaChart, ComposedChart, etc.).
 * Provides consistent layout, styling, and formatting across dashboards.
 *
 * @example
 * // Default (single or multi-series, no custom format)
 * <Tooltip content={<UnifiedTooltip />} />
 *
 * @example
 * // With unit suffix
 * <Tooltip content={<UnifiedTooltip valueUnit=" %" />} />
 *
 * @example
 * // With custom formatters
 * <Tooltip
 *   content={
 *     <UnifiedTooltip
 *       labelFormatter={(l) => new Date(l).toLocaleString()}
 *       valueFormatter={(v, n) => `${n}: ${Number(v).toFixed(1)} %`}
 *     />
 *   }
 * />
 */
const UnifiedTooltip: React.FC<UnifiedTooltipProps> = ({
  active,
  payload,
  label,
  labelFormatter = defaultLabelFormatter,
  valueFormatter,
  valueUnit,
  labelTitle,
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  if (!active || !payload?.length) {
    return null;
  }

  const displayLabel = label != null ? labelFormatter(String(label)) : '';
  const formatValue = (
    value: number | string,
    name: string,
    item: UnifiedTooltipPayloadItem
  ) =>
    valueFormatter
      ? valueFormatter(value, name, item)
      : defaultValueFormatter(value, name, item, valueUnit);

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      boxShadow="md"
      px={3}
      py={2}
      minW="140px"
    >
      <VStack align="stretch" spacing={1.5}>
        {labelTitle && (
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color={mutedColor}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {labelTitle}
          </Text>
        )}
        {displayLabel && (
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            {displayLabel}
          </Text>
        )}
        <VStack
          align="stretch"
          spacing={1}
          pt={displayLabel || labelTitle ? 1 : 0}
        >
          {payload.map((item, index) => {
            const name = (item.name ?? item.dataKey ?? '') as string;
            const value = item.value;
            const color = item.color ?? undefined;
            const displayValue = formatValue(
              value as number | string,
              name,
              item
            );
            return (
              <Box
                key={`${item.dataKey ?? index}-${name}`}
                display="flex"
                alignItems="center"
                gap={2}
              >
                {color && (
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="sm"
                    bg={color}
                    flexShrink={0}
                  />
                )}
                <Text fontSize="sm" color={textColor} noOfLines={1}>
                  {name && (
                    <Text as="span" color={mutedColor} mr={1}>
                      {name}:
                    </Text>
                  )}
                  <Text as="span" fontWeight="medium">
                    {displayValue}
                  </Text>
                </Text>
              </Box>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
};

export default UnifiedTooltip;
