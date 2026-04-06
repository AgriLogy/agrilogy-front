'use client';

import {
  Box,
  IconButton,
  Stack,
  type StackProps,
  Tooltip,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export type ChartLastDataShellProps = {
  chart: ReactNode;
  lastData: ReactNode;
} & Omit<StackProps, 'children'>;

/**
 * Chart + latest-readings column with a toggle to hide the chart (eye / eye-slash).
 */
export default function ChartLastDataShell({
  chart,
  lastData,
  direction = { base: 'column', md: 'row' },
  spacing = 4,
  align = 'stretch',
  width = '100%',
  /** Use `auto` so content (plot + date dragger) sets height; pass `100%` only inside a sized parent. */
  height = 'auto',
  maxH,
  minH,
  ...stackProps
}: ChartLastDataShellProps) {
  const [chartVisible, setChartVisible] = useState(true);

  return (
    <Box
      position="relative"
      width={width}
      height={height}
      maxH={maxH}
      minH={minH}
      overflowY={maxH != null ? 'auto' : undefined}
    >
      <Tooltip
        label={
          chartVisible
            ? 'Masquer le graphique (données récentes seulement)'
            : 'Afficher le graphique'
        }
        hasArrow
        placement="left"
      >
        <IconButton
          aria-label={
            chartVisible ? 'Masquer le graphique' : 'Afficher le graphique'
          }
          icon={chartVisible ? <FaEyeSlash /> : <FaEye />}
          size="sm"
          variant="ghost"
          colorScheme="blue"
          position="absolute"
          top={0}
          right={0}
          zIndex={4}
          onClick={() => setChartVisible((v) => !v)}
        />
      </Tooltip>
      <Stack
        direction={direction}
        spacing={spacing}
        width="100%"
        height="auto"
        align={align}
        pt={1}
        pr={{ base: 10, md: 10 }}
        {...stackProps}
      >
        {chartVisible ? chart : null}
        {lastData}
      </Stack>
    </Box>
  );
}
